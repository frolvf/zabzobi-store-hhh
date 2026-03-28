import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, CreditCard, Building2, Wallet, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PromoCodeInput from "@/components/PromoCodeInput";

const paymentMethods = [
  {
    id: "wafacash",
    label: "WafaCash",
    icon: Wallet,
    description: "Envoyez le montant via WafaCash et uploadez la preuve",
    instructions: "Envoyez le montant total au numéro: 06 00 00 00 00. Prenez une photo du reçu et uploadez-la ci-dessous.",
  },
  {
    id: "cashplus",
    label: "CashPlus",
    icon: CreditCard,
    description: "Payez via CashPlus et uploadez le reçu",
    instructions: "Effectuez un dépôt CashPlus au numéro: 06 00 00 00 00. Prenez une photo du reçu et uploadez-la ci-dessous.",
  },
  {
    id: "bank_transfer",
    label: "Virement Bancaire",
    icon: Building2,
    description: "Virement vers notre compte bancaire",
    instructions: "RIB: 000 000 0000000000 000000 00\nBanque: CIH Bank\nTitulaire: Zuoss Shop SARL\nUploadez la capture du virement ci-dessous.",
  },
];

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const finalPrice = Math.max(0, totalPrice - discount);

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (items.length === 0 && !orderSuccess) {
    navigate("/cart");
    return null;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Le fichier ne doit pas dépasser 5 Mo");
      return;
    }
    setProofFile(file);
    setProofPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!selectedMethod) {
      toast.error("Veuillez choisir un mode de paiement");
      return;
    }
    if (!proofFile) {
      toast.error("Veuillez uploader la preuve de paiement");
      return;
    }

    setSubmitting(true);
    try {
      // Upload payment proof
      const ext = proofFile.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("payment-proofs")
        .upload(filePath, proofFile);

      if (uploadError) throw uploadError;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: finalPrice,
          payment_method: selectedMethod,
          payment_proof_url: filePath,
          notes: notes || null,
          status: "pending",
          promo_code: promoCode,
          discount_amount: discount,
        } as any)
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        game_id: item.game.id,
        price: item.game.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      setOrderSuccess(true);
      toast.success("Commande passée avec succès !");
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la commande");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 container mx-auto px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-lg mx-auto text-center py-20"
          >
            <CheckCircle className="w-20 h-20 text-neon-green mx-auto mb-6" />
            <h1 className="font-display text-3xl font-bold text-foreground mb-3">Commande confirmée !</h1>
            <p className="text-muted-foreground mb-2">
              Votre commande a été envoyée avec succès. Nous allons vérifier votre paiement et vous livrer vos produits.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Vous recevrez vos identifiants par email une fois le paiement vérifié.
            </p>
            <button
              onClick={() => navigate("/catalog")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg"
            >
              Continuer vos achats
            </button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  const selectedInfo = paymentMethods.find((m) => m.id === selectedMethod);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12 container mx-auto px-4">
        <button onClick={() => navigate("/cart")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour au panier
        </button>

        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Finaliser la commande</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Payment method + proof */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment methods */}
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">Mode de paiement</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {paymentMethods.map((method) => (
                  <motion.button
                    key={method.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedMethod === method.id
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-muted-foreground/30"
                    }`}
                  >
                    <method.icon className={`w-6 h-6 mb-2 ${selectedMethod === method.id ? "text-primary" : "text-muted-foreground"}`} />
                    <p className="font-semibold text-sm text-foreground">{method.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{method.description}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Instructions */}
            {selectedInfo && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-primary/5 border border-primary/20"
              >
                <h3 className="font-semibold text-sm text-primary mb-2">Instructions de paiement</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{selectedInfo.instructions}</p>
              </motion.div>
            )}

            {/* Proof upload */}
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">Preuve de paiement</h2>
              <label className="flex flex-col items-center justify-center w-full h-44 rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-card cursor-pointer transition-colors">
                {proofPreview ? (
                  <img src={proofPreview} alt="Preuve" className="h-full w-full object-contain rounded-xl p-2" />
                ) : (
                  <div className="flex flex-col items-center text-muted-foreground">
                    <Upload className="w-8 h-8 mb-2" />
                    <p className="text-sm font-medium">Cliquez ou glissez le reçu ici</p>
                    <p className="text-xs mt-1">PNG, JPG ou PDF (max 5 Mo)</p>
                  </div>
                )}
                <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />
              </label>
            </div>

            {/* Notes */}
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground mb-3">Notes (optionnel)</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Informations supplémentaires..."
                maxLength={500}
                className="w-full h-24 rounded-xl bg-card border border-border p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-xl bg-card border border-border">
              <h2 className="font-display text-lg font-bold text-foreground mb-4">Résumé</h2>
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.game.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground line-clamp-1 flex-1 mr-2">{item.game.title}</span>
                    <span className="text-foreground font-medium whitespace-nowrap">{item.game.price} MAD</span>
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <PromoCodeInput
                  subtotal={totalPrice}
                  onApply={(code, disc) => { setPromoCode(code); setDiscount(disc); }}
                  onRemove={() => { setPromoCode(null); setDiscount(0); }}
                  appliedCode={promoCode}
                  discount={discount}
                />
              </div>
              <div className="border-t border-border pt-3 mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span className="text-foreground">{totalPrice} MAD</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Réduction</span>
                    <span className="text-green-400 font-semibold">-{discount} MAD</span>
                  </div>
                )}
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-muted-foreground">Frais</span>
                  <span className="text-green-400 font-semibold">Gratuit</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-xl font-bold text-primary">{finalPrice} MAD</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting || !selectedMethod || !proofFile}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours...
                  </>
                ) : (
                  "Confirmer la commande"
                )}
              </button>

              <p className="text-xs text-muted-foreground text-center mt-3">
                Livraison instantanée après vérification du paiement
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
