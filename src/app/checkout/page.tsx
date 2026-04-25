"use client";

import { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  Check, CreditCard, Building2, Smartphone, Wallet, Banknote,
  Lock, Package, ChevronRight, MapPin, ArrowLeft,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

const STEPS = ["Delivery", "Payment", "Review"];

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", sub: "GPay · PhonePe · Paytm", icon: Smartphone, recommended: true },
  { id: "card", label: "Credit / Debit Card", sub: "Visa · MC · RuPay", icon: CreditCard, recommended: false },
  { id: "netbanking", label: "Net Banking", sub: "SBI · HDFC · ICICI · Axis", icon: Building2, recommended: false },
  { id: "emi", label: "EMI", sub: "Starting ₹416/month", icon: Wallet, recommended: false },
  { id: "cod", label: "Cash on Delivery", sub: "₹49 COD fee applies", icon: Banknote, recommended: false },
];

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const { items, total, clearCart, isLoaded } = useCart();

  const codFee = paymentMethod === "cod" ? 49 : 0;
  const shippingFee = total >= 799 ? 0 : 99;
  const gst = Math.round(total * 0.18);
  const grandTotal = total + codFee + shippingFee + gst;

  const handlePayment = async () => {
    setProcessing(true);
    try {
      if (paymentMethod === "cod") {
        const orderRes = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items, address, paymentMethod, paymentStatus: "pending",
            subtotal: total, tax: gst, shippingFee, total: grandTotal,
          }),
        });
        if (orderRes.ok) {
          const newOrderId = `GG-2026-${Math.floor(Math.random() * 9000 + 1000)}`;
          setOrderId(newOrderId);
          setOrderPlaced(true);
          clearCart();
        }
        setProcessing(false);
        return;
      }

      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: grandTotal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: data.order?.amount || data.amount,
        currency: data.order?.currency || data.currency,
        name: "GiftGenius",
        description: "Gift Purchase",
        order_id: data.order?.id || data.id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async function (response: any) {
          const newOrderId = `GG-2026-${Math.floor(Math.random() * 9000 + 1000)}`;
          setOrderId(newOrderId);
          setOrderPlaced(true);
          clearCart();
        },
        prefill: { name: address.name, contact: address.phone },
        theme: { color: "#7C3AED" },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setProcessing(false);
    }
  };

  // Cart items load asynchronously from localStorage
  // Show empty state gracefully until they arrive

  if (orderPlaced) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0D0F1A] flex items-center justify-center pt-24 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <div className="w-20 h-20 rounded-full bg-[#10B981]/20 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-[#10B981]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">
              Order Confirmed! 🎉
            </h1>
            <p className="text-sm text-[#9CA3AF] mb-6">
              Your gift is on its way. You&apos;ll receive tracking details on your phone.
            </p>
            <div className="rounded-2xl bg-[#1F2023] border border-[#2E2E38] p-4 mb-6">
              <p className="text-xs text-[#9CA3AF]">Order ID</p>
              <p className="text-lg text-white font-bold">{orderId}</p>
              <p className="text-xs text-[#10B981] mt-2">📦 Estimated delivery: 3-5 business days</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Link href="/">
                <Button className="rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9B87F5] text-white">
                  Back to Home
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  // Show loading while cart data loads from localStorage
  if (!isLoaded) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0D0F1A] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#7C3AED]/30 border-t-[#7C3AED] rounded-full animate-spin" />
        </div>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0D0F1A] flex flex-col items-center justify-center gap-4 pt-24">
          <p className="text-white text-xl">Your cart is empty</p>
          <Link href="/">
            <Button className="rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9B87F5] text-white">
              Continue Shopping
            </Button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Navbar />
      <main className="min-h-screen bg-[#0D0F1A] pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4">
          {/* Stepper */}
          <div className="flex items-center justify-center gap-4 mb-12">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    i <= step
                      ? "bg-[#7C3AED] text-white"
                      : "bg-[#1F2023] text-[#9CA3AF]"
                  }`}
                >
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-sm ${i <= step ? "text-white" : "text-[#9CA3AF]"}`}>
                  {s}
                </span>
                {i < STEPS.length - 1 && <div className="w-12 h-px bg-[#2E2E38] mx-2" />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Form steps */}
            <div className="lg:col-span-2 space-y-6">
              {step === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#7C3AED]" /> Delivery Address
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: "name", label: "Full Name", placeholder: "Priya Sharma", span: 1 },
                      { key: "phone", label: "Phone Number", placeholder: "+91 98765 43210", span: 1 },
                      { key: "line1", label: "Address Line 1", placeholder: "Flat 402, Celestia Towers", span: 2 },
                      { key: "line2", label: "Address Line 2", placeholder: "Andheri West", span: 2 },
                      { key: "city", label: "City", placeholder: "Mumbai", span: 1 },
                      { key: "state", label: "State", placeholder: "Maharashtra", span: 1 },
                      { key: "pincode", label: "Pincode", placeholder: "400053", span: 1 },
                    ].map((field) => (
                      <div
                        key={field.key}
                        className={`space-y-1 ${field.span === 2 ? "md:col-span-2" : ""}`}
                      >
                        <label className="text-xs text-[#9CA3AF]">{field.label}</label>
                        <input
                          value={(address as Record<string, string>)[field.key]}
                          onChange={(e) => setAddress({ ...address, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          className="w-full bg-[#1F2023] border border-[#2E2E38] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#9CA3AF]/40 outline-none focus:border-[#7C3AED]/50 transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => setStep(1)}
                    className="w-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9B87F5] text-white py-6"
                  >
                    Continue to Payment <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#7C3AED]" /> Choose Payment Method
                  </h2>
                  <div className="space-y-3">
                    {PAYMENT_METHODS.map((pm) => (
                      <button
                        key={pm.id}
                        onClick={() => setPaymentMethod(pm.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all ${
                          paymentMethod === pm.id
                            ? "bg-[#7C3AED]/10 border border-[#7C3AED]/30"
                            : "bg-[#1F2023] border border-[#2E2E38] hover:border-[#2E2E38]/80"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          paymentMethod === pm.id ? "bg-[#7C3AED]/20" : "bg-[#2E2E38]"
                        }`}>
                          <pm.icon className={`w-5 h-5 ${paymentMethod === pm.id ? "text-[#9B87F5]" : "text-[#9CA3AF]"}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white">{pm.label}</span>
                            {pm.recommended && (
                              <span className="text-[9px] bg-[#10B981]/20 text-[#10B981] px-2 py-0.5 rounded-full font-bold">
                                RECOMMENDED
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-[#9CA3AF]">{pm.sub}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === pm.id ? "border-[#7C3AED] bg-[#7C3AED]" : "border-[#2E2E38]"
                        }`}>
                          {paymentMethod === pm.id && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
                    <Lock className="w-3.5 h-3.5 text-[#10B981]" /> Secured by Razorpay · PCI-DSS Compliant
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(0)} className="rounded-full">
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <Button
                      onClick={() => setStep(2)}
                      className="flex-1 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9B87F5] text-white"
                    >
                      Review Order <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white">Review & Pay</h2>

                  {/* Address Summary */}
                  <div className="rounded-2xl bg-[#1F2023] border border-[#2E2E38] p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#9CA3AF]">Delivering to</span>
                      <button onClick={() => setStep(0)} className="text-[10px] text-[#9B87F5]">Edit</button>
                    </div>
                    <p className="text-sm text-white font-medium">{address.name || "—"}</p>
                    <p className="text-xs text-[#9CA3AF]">
                      {address.line1 || "—"}, {address.city || "—"} — {address.pincode || "—"}
                    </p>
                  </div>

                  {/* Payment Summary */}
                  <div className="rounded-2xl bg-[#1F2023] border border-[#2E2E38] p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#9CA3AF]">Payment</span>
                      <button onClick={() => setStep(1)} className="text-[10px] text-[#9B87F5]">Change</button>
                    </div>
                    <p className="text-sm text-white font-medium">
                      {PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.label}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(1)} className="rounded-full">
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <Button
                      onClick={handlePayment}
                      disabled={processing}
                      className="flex-1 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9B87F5] text-white py-6 text-base font-bold"
                    >
                      {processing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>Pay Now — ₹{grandTotal.toLocaleString()}</>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right: Order Summary — always visible */}
            <div className="rounded-2xl bg-[#1F2023] border border-[#2E2E38] p-6 h-fit sticky top-24">
              <h3 className="text-white font-semibold text-lg mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-[#9CA3AF] truncate max-w-[60%]">{item.name} × {item.quantity}</span>
                    <span className="text-white">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 border-t border-[#2E2E38] pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">Subtotal</span>
                  <span className="text-white">₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">GST (18%)</span>
                  <span className="text-white">₹{gst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">Shipping</span>
                  <span className={shippingFee === 0 ? "text-[#10B981]" : "text-white"}>
                    {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                  </span>
                </div>
                {codFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#9CA3AF]">COD Fee</span>
                    <span className="text-white">₹{codFee}</span>
                  </div>
                )}
              </div>
              <div className="border-t border-[#2E2E38] pt-4 mt-4 flex justify-between">
                <span className="text-white font-semibold">Total</span>
                <span className="text-white font-bold text-lg">₹{grandTotal.toLocaleString()}</span>
              </div>
              {total >= 799 && (
                <p className="text-[#10B981] text-xs mt-2">✓ Free shipping applied</p>
              )}
              <div className="flex items-center gap-2 text-[10px] text-[#9CA3AF] mt-4">
                <Lock className="w-3 h-3 text-[#10B981]" /> PCI-DSS · 7-day returns · GST invoice
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
