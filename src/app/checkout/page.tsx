"use client";

import { useState } from "react";
import Image from "next/image";
import Script from "next/script";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Check, CreditCard, Building2, Smartphone, Wallet, Banknote,
  Gift, Lock, Package, ChevronRight, MapPin,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatINR } from "@/lib/utils";

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
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
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

  const { items, subtotal, getProduct, clearCart } = useCart();
  const { addToast } = useToast();

  const discount = couponApplied ? 500 : 0;
  const gstAmount = Math.round((subtotal - discount) * 0.18);
  const shippingFee = subtotal >= 999 ? 0 : 99;
  const codFee = paymentMethod === "cod" ? 49 : 0;
  const wrapFee = giftWrap ? 99 : 0;
  const total = subtotal - discount + gstAmount + shippingFee + codFee + wrapFee;

  const handlePayment = async () => {
    setProcessing(true);

    try {
      if (paymentMethod === "cod") {
        const orderRes = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items, address, paymentMethod, paymentStatus: "pending",
            subtotal, tax: gstAmount, shippingFee, total
          }),
        });
        
        if (orderRes.ok) {
          setOrderId(`GG-2026-${Math.floor(Math.random() * 9000 + 1000)}`);
          setOrderPlaced(true);
          clearCart();
          addToast("success", "Order Placed! 🎉", "Your COD order is confirmed.");
        }
        setProcessing(false);
        return;
      }

      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
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
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();

          if (verifyRes.ok && verifyData.verified) {
            await fetch("/api/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                items, address, paymentMethod, paymentStatus: "paid",
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                subtotal, tax: gstAmount, shippingFee, total
              }),
            });

            setOrderId(`GG-2026-${Math.floor(Math.random() * 9000 + 1000)}`);
            setOrderPlaced(true);
            clearCart();
            addToast("success", "Payment Successful! 🎉", "Your order has been placed.");
          } else {
            addToast("error", "Payment Failed", "Signature verification failed");
          }
        },
        prefill: {
          name: address.name,
          contact: address.phone,
        },
        theme: {
          color: "#8B5CF6",
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay(options);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rzp.on("payment.failed", function (response: any) {
        addToast("error", "Payment Failed", response.error.description);
      });
      rzp.open();
    } catch (error) {
      console.error(error);
      addToast("error", "Payment Error", "Could not initiate payment");
    } finally {
      setProcessing(false);
    }
  };

  if (orderPlaced) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-24 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <div className="w-20 h-20 rounded-full bg-teal/20 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-teal" />
            </div>
            <h1 className="text-3xl font-[var(--font-heading)] italic text-white mb-3">
              Order Confirmed! 🎉
            </h1>
            <p className="text-sm text-white/50 font-[var(--font-body)] mb-6">
              Your gift is on its way. You&apos;ll receive tracking details on your phone.
            </p>
            <div className="liquid-glass rounded-xl p-4 mb-6">
              <p className="text-xs text-white/40 font-[var(--font-body)]">Order ID</p>
              <p className="font-[var(--font-mono)] text-lg text-white">
                {orderId}
              </p>
              <p className="text-xs text-teal font-[var(--font-body)] mt-2">
                📦 Estimated delivery: Apr 25-27
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Link
                href={`/orders/${orderId}`}
                className="px-6 py-3 rounded-full bg-violet text-white text-sm font-medium hover:bg-violet-light transition-colors"
              >
                Track Order
              </Link>
              <Link
                href="/"
                className="px-6 py-3 rounded-full bg-white/5 text-white/70 text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto">
        {/* Stepper */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  i <= step
                    ? "bg-violet text-white"
                    : "bg-white/5 text-white/30"
                }`}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={`text-sm font-[var(--font-body)] ${
                  i <= step ? "text-white" : "text-white/30"
                }`}
              >
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div className="w-12 h-px bg-white/10 mx-2" />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {step === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-[var(--font-heading)] italic text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-violet-light" /> Delivery Address
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
                      <label className="text-xs text-white/50 font-[var(--font-body)]">
                        {field.label}
                      </label>
                      <input
                        value={(address as Record<string, string>)[field.key]}
                        onChange={(e) =>
                          setAddress({ ...address, [field.key]: e.target.value })
                        }
                        placeholder={field.placeholder}
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-violet/40 transition-colors font-[var(--font-body)]"
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-violet text-white text-sm font-semibold hover:bg-violet-light transition-colors"
                >
                  Continue to Payment <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-[var(--font-heading)] italic text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-violet-light" /> Choose Payment Method
                </h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((pm) => (
                    <button
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all ${
                        paymentMethod === pm.id
                          ? "bg-violet/10 border border-violet/30"
                          : "bg-white/[0.02] border border-white/[0.06] hover:border-white/10"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          paymentMethod === pm.id
                            ? "bg-violet/20"
                            : "bg-white/5"
                        }`}
                      >
                        <pm.icon
                          className={`w-5 h-5 ${
                            paymentMethod === pm.id ? "text-violet-light" : "text-white/40"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white font-[var(--font-display)]">
                            {pm.label}
                          </span>
                          {pm.recommended && (
                            <span className="text-[9px] bg-teal/20 text-teal px-2 py-0.5 rounded-full font-bold">
                              RECOMMENDED
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-white/40 font-[var(--font-body)]">
                          {pm.sub}
                        </span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === pm.id
                            ? "border-violet bg-violet"
                            : "border-white/20"
                        }`}
                      >
                        {paymentMethod === pm.id && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs text-white/30 font-[var(--font-body)]">
                  <Lock className="w-3.5 h-3.5 text-teal" />
                  Secured by Razorpay · PCI-DSS Compliant
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(0)}
                    className="px-6 py-3 rounded-full bg-white/5 text-white/60 text-sm hover:bg-white/10 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 rounded-full bg-violet text-white text-sm font-semibold hover:bg-violet-light transition-colors flex items-center justify-center gap-2"
                  >
                    Review Order <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-[var(--font-heading)] italic text-white">
                  Review & Pay
                </h2>

                {/* Address Summary */}
                <div className="liquid-glass rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/50 font-[var(--font-body)]">
                      Delivering to
                    </span>
                    <button
                      onClick={() => setStep(0)}
                      className="text-[10px] text-violet-light"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-white font-[var(--font-display)]">
                    {address.name || "Priya Sharma"}
                  </p>
                  <p className="text-xs text-white/50 font-[var(--font-body)]">
                    {address.line1 || "Flat 402, Celestia Towers"},{" "}
                    {address.city || "Mumbai"} — {address.pincode || "400053"}
                  </p>
                </div>

                {/* Payment Summary */}
                <div className="liquid-glass rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/50 font-[var(--font-body)]">
                      Payment
                    </span>
                    <button
                      onClick={() => setStep(1)}
                      className="text-[10px] text-violet-light"
                    >
                      Change
                    </button>
                  </div>
                  <p className="text-sm text-white font-[var(--font-display)]">
                    {PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.label}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 rounded-full bg-white/5 text-white/60 text-sm hover:bg-white/10"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={processing}
                    className="flex-1 py-4 rounded-full bg-gradient-to-r from-violet to-violet-light text-white text-sm font-bold hover:shadow-lg hover:shadow-violet/20 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Pay Now — {formatINR(total)}</>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-2">
            <div className="liquid-glass rounded-2xl p-6 space-y-4 sticky top-24">
              <h3 className="text-lg font-[var(--font-heading)] italic text-white">
                Order Summary
              </h3>

              {/* Items */}
              {items.map((item) => {
                const prod = getProduct(item.productId);
                if (!prod) return null;
                return (
                  <div key={item.productId} className="flex gap-3">
                    <div className="relative w-14 h-14 rounded-lg bg-card overflow-hidden flex-shrink-0">
                      <Image
                        src={prod.image}
                        alt={prod.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white font-[var(--font-display)] truncate">
                        {prod.name}
                      </p>
                      <p className="text-[10px] text-white/40">
                        {item.color} · {item.size} · × {item.quantity}
                      </p>
                      <p className="text-xs text-white font-[var(--font-mono)]">
                        {formatINR(prod.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                );
              })}

              {items.length === 0 && (
                <p className="text-xs text-white/40 text-center py-4">
                  Cart is empty.{" "}
                  <Link href="/" className="text-violet-light">
                    Shop now
                  </Link>
                </p>
              )}

              {/* Gift Options */}
              <label className="flex items-center gap-3 cursor-pointer py-2 border-t border-white/5">
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center ${
                    giftWrap
                      ? "bg-violet"
                      : "bg-white/5 border border-white/10"
                  }`}
                >
                  {giftWrap && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                <span className="text-xs text-white/60 font-[var(--font-body)]">
                  🎁 Gift Wrap (+₹99)
                </span>
              </label>

              {giftWrap && (
                <input
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder="📝 Add a personal message..."
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none"
                />
              )}

              {/* Coupon */}
              <div className="flex gap-2">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  placeholder="Coupon code"
                  className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none font-[var(--font-mono)]"
                />
                <button
                  onClick={() => {
                    if (coupon === "GIFT500") {
                      setCouponApplied(true);
                      addToast("success", "Coupon Applied!", "₹500 discount");
                    } else {
                      addToast("error", "Invalid Coupon", "Try GIFT500");
                    }
                  }}
                  className="px-4 py-2 rounded-lg bg-violet/20 text-violet-light text-xs font-medium hover:bg-violet/30"
                >
                  Apply
                </button>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex justify-between text-xs font-[var(--font-body)]">
                  <span className="text-white/40">Subtotal</span>
                  <span className="text-white/70 font-[var(--font-mono)]">{formatINR(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-xs font-[var(--font-body)]">
                    <span className="text-teal">Discount (GIFT500)</span>
                    <span className="text-teal font-[var(--font-mono)]">-{formatINR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-[var(--font-body)]">
                  <span className="text-white/40">GST (18%)</span>
                  <span className="text-white/70 font-[var(--font-mono)]">{formatINR(gstAmount)}</span>
                </div>
                <div className="flex justify-between text-xs font-[var(--font-body)]">
                  <span className="text-white/40">Shipping</span>
                  <span className="text-teal font-[var(--font-mono)]">
                    {shippingFee === 0 ? "FREE" : formatINR(shippingFee)}
                  </span>
                </div>
                {wrapFee > 0 && (
                  <div className="flex justify-between text-xs font-[var(--font-body)]">
                    <span className="text-white/40">Gift Wrap</span>
                    <span className="text-white/70 font-[var(--font-mono)]">{formatINR(wrapFee)}</span>
                  </div>
                )}
                {codFee > 0 && (
                  <div className="flex justify-between text-xs font-[var(--font-body)]">
                    <span className="text-white/40">COD Fee</span>
                    <span className="text-white/70 font-[var(--font-mono)]">{formatINR(codFee)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-white/5">
                <span className="text-sm font-semibold text-white font-[var(--font-display)]">
                  Total
                </span>
                <span className="font-[var(--font-mono)] text-xl font-bold text-white">
                  {formatINR(total)}
                </span>
              </div>

              {/* Delivery Estimate */}
              <div className="flex items-center gap-2 text-xs text-white/40 font-[var(--font-body)]">
                <Package className="w-3.5 h-3.5 text-teal" />
                Est. delivery: Apr 25-27
              </div>

              <div className="flex items-center gap-3 text-[10px] text-white/25 font-[var(--font-body)]">
                <Lock className="w-3 h-3 text-teal" /> PCI-DSS · 7-day returns · GST invoice
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
