import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    Car, Shield, Clock, Star, ChevronRight,
    MapPin, Fuel, Users, ArrowRight, CheckCircle
} from 'lucide-react'
import { AuthContext } from '@/main'
import heroImg from '@/assets/hero.png'

const PORSCHE_IMG = "https://tse4.mm.bing.net/th/id/OIP.XGwRIDdSctcbwZr0uXK1dwHaCn?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"

// ── Data ──────────────────────────────────────────────────

const FEATURES = [
    {
        icon: <Car size={28} className="text-blue-600" />,
        title: 'Wide Selection',
        desc: 'Choose from sedans, SUVs, electrics, sports cars and more — all in one place.',
    },
    {
        icon: <Shield size={28} className="text-blue-600" />,
        title: 'Fully Insured',
        desc: 'Every car comes with comprehensive insurance so you can drive with confidence.',
    },
    {
        icon: <Clock size={28} className="text-blue-600" />,
        title: 'Flexible Hours',
        desc: 'Book by the hour. No minimum days, no hidden fees — pay only for what you use.',
    },
    {
        icon: <Star size={28} className="text-blue-600" />,
        title: 'Top Rated',
        desc: 'Thousands of happy customers. Real reviews, real ratings on every car.',
    },
]

const STEPS = [
    { step: '01', title: 'Create Account', desc: 'Sign up in seconds — no credit card required.' },
    { step: '02', title: 'Pick Your Car', desc: 'Browse our fleet and filter by type, price, or rating.' },
    { step: '03', title: 'Book Instantly', desc: 'Choose your pickup and return time, confirm and go.' },
]

const STATS = [
    { value: '500+', label: 'Cars Available' },
    { value: '10k+', label: 'Happy Customers' },
    { value: '50+', label: 'Cities Covered' },
    { value: '4.9★', label: 'Average Rating' },
]

const TESTIMONIALS = [
    {
        name: 'Devasena Medavaram',
        role: 'Business Traveller',
        text: 'Booked a sedan for a client meeting in under 2 minutes. Smooth experience from start to finish.',
        rating: 5,
    },
    {
        name: 'Baji Shaik',
        role: 'Weekend Explorer',
        text: 'The SUV was spotless and the hourly pricing saved me a lot compared to daily rentals.',
        rating: 5,
    },
    {
        name: 'Manoj Reddy BAsani',
        role: 'Daily Commuter',
        text: 'I use RentX every week. The app is fast, the cars are reliable, and support is great.',
        rating: 4,
    },
]

// ── Component ─────────────────────────────────────────────

function Home() {
    const { currentUser, role } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleCTA = () => {
        if (!currentUser) return // navbar login dialog handles this
        navigate(role === 'admin' ? '/dashboard' : '/browsecars')
    }

    return (
        <div className="bg-white">

            {/* ── Hero ─────────────────────────────────────── */}
            <section
                className="relative min-h-[90vh] flex items-center overflow-hidden"
                style={{
                    backgroundImage: `url(${PORSCHE_IMG})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Dark overlay so text stays readable */}
                <div className="absolute inset-0 bg-slate-900/70" />
                {/* Blue tint overlay for brand feel */}
                <div className="absolute inset-0 bg-blue-950/40" />
                {/* Subtle glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
                    {/* Left — text only, full width on bg image layout */}
                    <div className="flex flex-col gap-6 max-w-2xl">
                        <span className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-400 text-sm font-semibold px-4 py-1.5 rounded-full w-fit border border-blue-500/30">
                            <MapPin size={14} /> Available across Hyderabad
                        </span>

                        <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                            Drive Your Way,<br />
                            <span className="text-orange-400 italic">Any Time.</span>
                        </h1>

                        <p className="text-gray-300 text-lg max-w-md leading-relaxed">
                            Rent premium cars by the hour. No paperwork, no hassle —
                            just pick, book, and drive.
                        </p>

                        <div className="flex flex-wrap gap-3 mt-2">
                            {currentUser ? (
                                <button
                                    onClick={handleCTA}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-semibold text-base transition-colors"
                                >
                                    {role === 'admin' ? 'Go to Dashboard' : 'Browse Cars'}
                                    <ArrowRight size={18} />
                                </button>
                            ) : (
                                <>
                                    <Link
                                        to="/browsecars"
                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-semibold text-base transition-colors"
                                    >
                                        Get Started <ArrowRight size={18} />
                                    </Link>
                                    <Link
                                        to="/browsecars"
                                        className="flex items-center gap-2 border border-white/30 text-white hover:bg-white/10 px-7 py-3 rounded-xl font-semibold text-base transition-colors"
                                    >
                                        Browse Cars
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Trust badges */}
                        <div className="flex flex-wrap gap-4 mt-2">
                            {['No hidden fees', 'Instant booking', 'Free cancellation'].map((t) => (
                                <div key={t} className="flex items-center gap-1.5 text-gray-400 text-sm">
                                    <CheckCircle size={14} className="text-green-400" />
                                    {t}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Stats Bar ────────────────────────────────── */}
            <section className="bg-blue-600 py-10">
                <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {STATS.map((s) => (
                        <div key={s.label}>
                            <p className="text-3xl font-extrabold text-white">{s.value}</p>
                            <p className="text-blue-100 text-sm mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Features ─────────────────────────────────── */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800">Why Choose RentX?</h2>
                        <p className="text-gray-500 mt-2">Everything you need for a seamless rental experience</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURES.map((f) => (
                            <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
                                <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center">
                                    {f.icon}
                                </div>
                                <h3 className="font-bold text-gray-800">{f.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How It Works ─────────────────────────────── */}
            <section className="py-20 bg-white">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800">How It Works</h2>
                        <p className="text-gray-500 mt-2">Three simple steps to get on the road</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connector line — desktop only */}
                        <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-0.5 bg-blue-100 z-0" />

                        {STEPS.map((s, i) => (
                            <div key={s.step} className="relative z-10 flex flex-col items-center text-center gap-4">
                                <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-extrabold shadow-lg">
                                    {s.step}
                                </div>
                                <h3 className="font-bold text-gray-800 text-lg">{s.title}</h3>
                                <p className="text-gray-500 text-sm">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Testimonials ─────────────────────────────── */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800">What Our Customers Say</h2>
                        <p className="text-gray-500 mt-2">Real reviews from real renters</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {TESTIMONIALS.map((t) => (
                            <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                                {/* Stars */}
                                <div className="flex gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            size={15}
                                            className={i < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
                                        />
                                    ))}
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">"{t.text}"</p>
                                <div className="flex items-center gap-3 mt-auto pt-3 border-t border-gray-100">
                                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                                        <p className="text-gray-400 text-xs">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA Banner ───────────────────────────────── */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
                <div className="max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-6">
                    <h2 className="text-4xl font-extrabold text-white">Ready to Hit the Road?</h2>
                    <p className="text-blue-100 text-lg">
                        Join thousands of drivers who trust RentX for their daily rides.
                    </p>
                    <Link
                        to="/browsecars"
                        className="flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors text-base"
                    >
                        Browse Cars Now <ChevronRight size={18} />
                    </Link>
                </div>
            </section>

            {/* ── Footer ───────────────────────────────────── */}
            <footer className="bg-slate-900 text-gray-400 py-10 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <img src="/carfav.png" alt="logo" className="w-8 h-8" />
                        <span className="text-white font-bold text-lg">
                            Rent<span className="text-orange-400 italic">X</span>
                        </span>
                    </div>
                    <p className="text-sm">© {new Date().getFullYear()} RentX. All rights reserved.</p>
                    <div className="flex gap-5 text-sm">
                        <Link to="/browsecars" className="hover:text-white transition-colors">Browse Cars</Link>
                        <Link to="/mybookings" className="hover:text-white transition-colors">My Bookings</Link>
                    </div>
                </div>
            </footer>

        </div>
    )
}

export default Home
