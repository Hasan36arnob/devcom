import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { resetCart } from "../../redux/orebiSlice";
import { createPayment } from "../../utils/api";

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartProducts = useSelector((state) => state.orebiReducer.products);

  // কার্টের মোট টাকার হিসাব
  const [totalAmt, setTotalAmt] = useState(0);
  const [shippingCharge, setShippingCharge] = useState(0);

  useEffect(() => {
    let price = 0;
    cartProducts.forEach((item) => {
      price += item.price * item.quantity;
    });
    setTotalAmt(price);
    setShippingCharge(price > 0 ? (price <= 200 ? 30 : price <= 400 ? 25 : 20) : 0);
  }, [cartProducts]);

  // কাস্টমার ইনফরমেশন স্টেট
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "Dhaka",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert("দয়া করে নাম, ফোন নাম্বার এবং ঠিকানা সঠিকভাবে লিখুন।");
      return;
    }

    setLoading(true);
    setMessage("");

    const orderId = "ORD" + Date.now();
    const finalAmount = totalAmt + shippingCharge;

    try {
      if (paymentMethod === "COD") {
        // ক্যাশ অন ডেলিভারি হলে সরাসরি সফলতার মেসেজ দেখাবে
        alert("আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে! (ক্যাশ অন ডেলিভারি)");
        dispatch(resetCart());
        navigate("/");
      } else {
        // বিকাশ, নগদ বা রকেটের এপিআই কল করা হচ্ছে
        const paymentData = {
          total_amount: finalAmount,
          tran_id: orderId,
          orderId: orderId,
          amount: finalAmount,
          merchantInvoiceNumber: orderId,
          cus_name: formData.name,
          cus_email: formData.email || "customer@example.com",
          cus_phone: formData.phone,
          cus_add1: formData.address,
          cus_city: formData.city,
          cus_country: "Bangladesh",
          items: cartProducts.map(p => ({ _id: p._id, productName: p.name, price: p.price, quantity: p.quantity })),
        };

        const result = await createPayment(paymentMethod, paymentData);

        if (result.GatewayPageURL) {
          // SSLCommerz বা অন্যান্য গেটওয়ের পেমেন্ট পেজে নিয়ে যাবে
          window.location.href = result.GatewayPageURL;
        } else if (result.bkashURL) {
          window.location.href = result.bkashURL;
        } else {
          alert(`${paymentMethod} পেমেন্ট গেটওয়ে রেসপন্স করেছে। এটি টেস্ট বা স্যান্ডবক্স মোডে রয়েছে।`);
          dispatch(resetCart());
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("পেমেন্ট প্রসেস করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-container mx-auto px-4 pb-20">
      <Breadcrumbs title="Checkout & Payment" />
      
      {cartProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* কাস্টমার ডিটেইলস ফর্ম */}
          <div className="bg-white p-6 border rounded-xl shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 text-slate-800">শিপিং ঠিকানা</h2>
            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">আপনার নাম *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brandIndigo outline-none"
                  placeholder="যেমন: আবির রহমান"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">মোবাইল নাম্বার *</label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brandIndigo outline-none"
                  placeholder="যেমন: 017XXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ইমেইল (ঐচ্ছিক)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brandIndigo outline-none"
                  placeholder="username@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">সম্পূর্ণ ঠিকানা *</label>
                <textarea
                  name="address"
                  required
                  rows="3"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brandIndigo outline-none"
                  placeholder="বাসা নং, রোড নং, এলাকা..."
                />
              </div>
            </form>
          </div>

          {/* পেমেন্ট মেথড এবং অর্ডার সামারি */}
          <div className="space-y-6">
            <div className="bg-white p-6 border rounded-xl shadow-sm">
              <h2 className="text-2xl font-semibold mb-6 text-slate-800">পেমেন্ট পদ্ধতি সিলেক্ট করুন</h2>
              <div className="grid grid-cols-2 gap-4">
                {/* ক্যাশ অন ডেলিভারি */}
                <div
                  onClick={() => setPaymentMethod("COD")}
                  className={`p-4 border rounded-xl cursor-pointer flex flex-col items-center justify-center transition-all ${
                    paymentMethod === "COD" ? "border-brandIndigo bg-indigo-50/50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="font-bold text-slate-700 text-sm">Cash on Delivery</span>
                  <span className="text-xs text-gray-500 mt-1">হাতে পেয়ে টাকা দিন</span>
                </div>

                {/* বিকাশ */}
                <div
                  onClick={() => setPaymentMethod("bkash")}
                  className={`p-4 border rounded-xl cursor-pointer flex flex-col items-center justify-center transition-all ${
                    paymentMethod === "bkash" ? "border-pink-500 bg-pink-50/30" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="font-bold text-pink-600 text-lg">bKash</span>
                  <span className="text-xs text-gray-500 mt-1">বিকাশ পেমেন্ট</span>
                </div>

                {/* নগদ */}
                <div
                  onClick={() => setPaymentMethod("nagad")}
                  className={`p-4 border rounded-xl cursor-pointer flex flex-col items-center justify-center transition-all ${
                    paymentMethod === "nagad" ? "border-orange-500 bg-orange-50/30" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="font-bold text-orange-600 text-lg">Nagad</span>
                  <span className="text-xs text-gray-500 mt-1">নগদ পেমেন্ট</span>
                </div>

                {/* রকেট */}
                <div
                  onClick={() => setPaymentMethod("rocket")}
                  className={`p-4 border rounded-xl cursor-pointer flex flex-col items-center justify-center transition-all ${
                    paymentMethod === "rocket" ? "border-purple-600 bg-purple-50/30" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="font-bold text-purple-700 text-lg">Rocket</span>
                  <span className="text-xs text-gray-500 mt-1">রকেট পেমেন্ট</span>
                </div>
              </div>
            </div>

            {/* অর্ডার সামারি */}
            <div className="bg-gray-50 p-6 border rounded-xl">
              <h3 className="text-xl font-bold mb-4 text-slate-800">অর্ডার সামারি</h3>
              <div className="space-y-2 border-b pb-4 mb-4">
                <div className="flex justify-between text-slate-600">
                  <span>সাবটোটাল:</span>
                  <span>${totalAmt}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>ডেলিভারি চার্জ:</span>
                  <span>${shippingCharge}</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-lg text-slate-800 mb-6">
                <span>সর্বমোট:</span>
                <span>${totalAmt + shippingCharge}</span>
              </div>

              <button
                disabled={loading}
                onClick={handleCheckout}
                className="w-full py-4 bg-brandIndigo text-white rounded-xl font-semibold text-lg hover:bg-slate-900 transition-colors duration-300 shadow-lg shadow-indigo-100 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "অর্ডার প্রসেস হচ্ছে..." : paymentMethod === "COD" ? "অর্ডার কনফার্ম করুন" : "পেমেন্ট করতে এগিয়ে যান"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed">
          <p className="text-xl font-medium text-slate-500 mb-4">আপনার কার্টটি খালি রয়েছে!</p>
          <Link to="/shop">
            <button className="px-6 py-2.5 bg-brandIndigo text-white rounded-lg hover:bg-slate-900 transition-colors">
              কেনাকাটা করুন
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Payment;