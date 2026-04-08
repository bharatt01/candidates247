import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Clock, QrCode, IndianRupee, Zap, Crown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import useSubscription from "@/hooks/useSubscription";
import qrImage from "@/assets/upi-qr-placeholder.png";

const PLANS = [
  { id: "starter", name: "Starter", price: 599, limit: 50, icon: Zap, popular: false },
  { id: "pro", name: "Pro", price: 699, limit: 100, icon: Crown, popular: true },
];

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const { hasActiveSubscription, requestSubscription, subscription } = useSubscription();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) navigate("/for-companies");
    if (userRole && userRole !== "company" && userRole !== "superadmin") navigate("/");
  }, [user, userRole, navigate]);

  const handlePaymentDone = async () => {
    if (!selectedPlan) return;
    setSubmitting(true);
    try {
      await requestSubscription(selectedPlan.id); // Firestore sets status=pending
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Failed to submit subscription. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (hasActiveSubscription && subscription) {
    return (
      <div className="min-h-screen bg-background relative">
        <div className="mesh-gradient" />

        <div className="relative z-10 max-w-lg mx-auto px-6 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-10">
            <CheckCircle size={48} className="text-primary mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">You have an active subscription!</h2>
            <p className="text-sm text-muted-foreground mb-2">
              <span className="font-semibold">{subscription.plan}</span> plan — {subscription.resumes_used}/{subscription.resume_limit} resumes used
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              You can add {subscription.resume_limit - subscription.resumes_used} more resumes.
            </p>
            <button
              onClick={() => navigate("/dashboard/company")}
              className="px-6 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors btn-haptic"
            >
              Go to Dashboard
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background relative">
        <div className="mesh-gradient" />
        
        <div className="relative z-10 max-w-lg mx-auto px-6 py-20 text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-10">
            <CheckCircle size={48} className="text-primary mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Subscription Request Submitted!</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Your <strong>{selectedPlan.name}</strong> plan (₹{selectedPlan.price}) request is under review. 
              Once our team verifies your payment, you'll be able to add up to {selectedPlan.limit} resumes.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-6">
              <Clock size={14} /> Usually verified within a few hours
            </div>
            <button
              onClick={() => navigate("/dashboard/company")}
              className="px-6 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors btn-haptic"
            >
              Go to Dashboard
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="mesh-gradient" />
  
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        {!selectedPlan ? (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Choose Your Plan</h1>
              <p className="text-sm text-muted-foreground">Unlock candidate resumes with a subscription</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PLANS.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`glass-card p-6 relative cursor-pointer hover:border-primary/30 transition-all ${plan.popular ? "border-primary/20 ring-1 ring-primary/10" : ""}`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-bold bg-primary text-primary-foreground">Most Popular</span>}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <plan.icon size={20} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                  </div>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-foreground">₹{plan.price}</span>
                    <span className="text-sm text-muted-foreground"> / subscription</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle size={14} className="text-primary shrink-0" /> Up to {plan.limit} resume unlocks
                    </li>
                    <li className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle size={14} className="text-primary shrink-0" /> Full contact details (phone & email)
                    </li>
                  </ul>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto">
            <div className="glass-card p-8">
              <h1 className="text-xl font-bold text-foreground mb-1 flex items-center gap-2">
                <IndianRupee size={20} className="text-primary" /> Complete Payment
              </h1>
              <p className="text-sm text-muted-foreground mb-6">Scan the QR code below to pay via UPI</p>
              <div className="flex flex-col items-center mb-6">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-border">
                  <img src={qrImage} alt="UPI Payment QR Code" className="w-48 h-48 object-contain" />
                </div>
                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
                  <QrCode size={12} /> Scan with any UPI app (GPay, PhonePe, Paytm)
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="flex-1 py-3 rounded-lg text-sm font-medium bg-muted/40 text-muted-foreground border border-border hover:text-foreground transition-colors btn-haptic"
                >
                  Back
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handlePaymentDone}
                  disabled={submitting}
                  className="flex-[2] py-3 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors btn-haptic disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "I've Made the Payment"}
                </motion.button>
              </div>
              <p className="text-[11px] text-muted-foreground text-center mt-2">
                After clicking, our team will verify the payment and activate your subscription.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;