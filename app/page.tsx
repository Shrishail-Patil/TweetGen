"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Check, Twitter, Zap, Sparkles, Clock, Award } from "lucide-react"
import FloatingElements from "./components/FloatingElements"


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
      <FloatingElements />

      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-2">
          <Twitter className="h-6 w-6 text-orange-500" />
          <span className="text-xl font-bold">TweetGeni</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/Login"             
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Login
          </Link>
          {/* <Link
            href="/Login"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Get Started
          </Link> */}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative z-10">
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Generate <span className="text-orange-500">Engaging Tweets</span> in Seconds
        </motion.h1>
        <motion.p
          className="text-xl text-gray-600 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          TweetGeni uses AI to craft the perfect tweets for your content. Save time, increase engagement, and grow your
          audience.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            href="/Login"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md text-lg font-medium flex items-center transition-colors w-full sm:w-auto justify-center shadow-lg hover:shadow-xl"
          >
            Start Generating Tweets
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <a
            href="#how-it-works"
            className="border border-gray-300 hover:border-gray-400 px-8 py-3 rounded-md text-lg font-medium transition-colors w-full sm:w-auto bg-white hover:bg-gray-50"
          >
            See How It Works
          </a>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose TweetGeni?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our platform is designed to help you create tweets that resonate with your audience and drive engagement.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-orange-100 p-3 rounded-full w-fit mb-6">
              <Zap className="h-6 w-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI-Powered Generation</h3>
            <p className="text-gray-600">
              Our advanced AI understands your content and creates tweets that capture its essence.
            </p>
          </motion.div>

          <motion.div
            className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-orange-100 p-3 rounded-full w-fit mb-6">
              <Sparkles className="h-6 w-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">Customizable Styles</h3>
            <p className="text-gray-600">
              Choose from various tweet styles and moods to match your brand voice and audience preferences.
            </p>
          </motion.div>

          <motion.div
            className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-orange-100 p-3 rounded-full w-fit mb-6">
              <Clock className="h-6 w-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">Save Hours of Time</h3>
            <p className="text-gray-600">
              Generate weeks worth of engaging tweets in minutes instead of spending hours crafting them manually.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Three simple steps to create engaging tweets for your content
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-1/3 right-1/3 h-0.5 bg-gray-200 -z-10"></div>

          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-6 shadow-md">
              1
            </div>
            <h3 className="text-xl font-bold mb-3">Choose Your Style</h3>
            <p className="text-gray-600">
              Select the mood, style, and structure that best fits your content and audience.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-6 shadow-md">
              2
            </div>
            <h3 className="text-xl font-bold mb-3">Describe Your Content</h3>
            <p className="text-gray-600">
              Enter details about your product, blog post, or content you want to promote.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-6 shadow-md">
              3
            </div>
            <h3 className="text-xl font-bold mb-3">Generate & Share</h3>
            <p className="text-gray-600">
              Get multiple tweet options, customize if needed, and share directly to your platforms.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8 md:p-12 shadow-lg">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">See TweetGeni in Action</h2>
              <p className="text-xl text-gray-600 mb-8">
                Watch how easy it is to generate engaging tweets that drive traffic and increase your social media
                presence.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Check className="h-6 w-6 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">Generate tweets for product launches, blog posts, or announcements</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-6 w-6 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">Customize the tone, style, and length to match your brand voice</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-6 w-6 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">Save your favorite templates for consistent messaging</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-xl">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="TweetGeni Demo"
                width={800}
                height={600}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of content creators who save time and increase engagement with TweetGeni
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-500 mr-3 flex items-center justify-center text-white font-bold">
                S
              </div>
              <div>
                <h4 className="font-bold">Sarah Johnson</h4>
                <p className="text-gray-500 text-sm">Content Creator</p>
              </div>
            </div>
            <p className="text-gray-700">
  &quot;TweetGeni has completely transformed my social media strategy. I used to spend hours crafting tweets, now
  I can generate a week&apos;s worth in minutes!&quot;
</p>
            <div className="flex mt-4">
              <Award className="h-5 w-5 text-orange-500" />
              <Award className="h-5 w-5 text-orange-500" />
              <Award className="h-5 w-5 text-orange-500" />
              <Award className="h-5 w-5 text-orange-500" />
              <Award className="h-5 w-5 text-orange-500" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-500 mr-3 flex items-center justify-center text-white font-bold">
                M
              </div>
              <div>
                <h4 className="font-bold">Mark Thompson</h4>
                <p className="text-gray-500 text-sm">SaaS Founder</p>
              </div>
            </div>
            <p className="text-gray-700">
  &quot;The engagement on our product tweets has increased by 43% since we started using TweetGeni. The AI
  understands our brand voice perfectly.&quot;
</p>
            <div className="flex mt-4">
              <Award className="h-5 w-5 text-orange-500" />
              <Award className="h-5 w-5 text-orange-500" />
              <Award className="h-5 w-5 text-orange-500" />
              <Award className="h-5 w-5 text-orange-500" />
              <Award className="h-5 w-5 text-orange-500" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-500 mr-3 flex items-center justify-center text-white font-bold">
                A
              </div>
              <div>
                <h4 className="font-bold">Alex Rivera</h4>
                <p className="text-gray-500 text-sm">Marketing Manager</p>
              </div>
            </div>
            <p className="text-gray-700">
  &quot;As someone managing multiple accounts, TweetGeni has been a game-changer. The variety of styles and tones
  available means each account maintains its unique voice.&quot;
</p>
            <div className="flex mt-4">
              <Award className="h-5 w-5 text-orange-500" />
              <Award className="h-5 w-5 text-orange-500" />
              <Award className="h-5 w-5 text-orange-500" />
              <Award className="h-5 w-5 text-orange-500" />
              <Award className="h-5 w-5 text-orange-500" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Choose the plan that works best for your needs</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div
            className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-2">Starter</h3>
            <p className="text-gray-500 mb-6">Perfect for individuals and small creators</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">$9</span>
              <span className="text-gray-500">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">50 tweets per month</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Basic customization</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Email support</span>
              </li>
            </ul>
            <Link
              href="/Login"
              className="block text-center w-full border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-6 py-2 rounded-md transition-colors"
            >
              Get Started
            </Link>
          </motion.div>

          <motion.div
            className="bg-orange-500 p-8 rounded-xl border border-orange-600 shadow-lg transform md:-translate-y-4"
            whileHover={{ y: -32 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
              Most Popular
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Professional</h3>
            <p className="text-orange-100 mb-6">Ideal for growing creators and small businesses</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$29</span>
              <span className="text-orange-100">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start text-white">
                <Check className="h-5 w-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                <span>200 tweets per month</span>
              </li>
              <li className="flex items-start text-white">
                <Check className="h-5 w-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                <span>Advanced customization</span>
              </li>
              <li className="flex items-start text-white">
                <Check className="h-5 w-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                <span>Priority support</span>
              </li>
              <li className="flex items-start text-white">
                <Check className="h-5 w-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                <span>Analytics dashboard</span>
              </li>
            </ul>
            <Link
              href="/Login"
              className="block text-center w-full bg-white text-orange-500 hover:bg-gray-100 px-6 py-2 rounded-md transition-colors shadow-md"
            >
              Get Started
            </Link>
          </motion.div>

          <motion.div
            className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-2">Business</h3>
            <p className="text-gray-500 mb-6">For teams and larger businesses</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">$79</span>
              <span className="text-gray-500">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Unlimited tweets</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Full customization</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Dedicated support</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Team collaboration</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">API access</span>
              </li>
            </ul>
            <Link
              href="/Login"
              className="block text-center w-full border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-6 py-2 rounded-md transition-colors"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-12 text-center shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Transform Your Twitter Strategy?</h2>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto mb-8">
            Join thousands of creators and businesses who are saving time and increasing engagement with TweetGeni.
          </p>
          <Link
            href="/Login"
            className="inline-flex items-center bg-white hover:bg-gray-100 text-orange-500 px-8 py-3 rounded-md text-lg font-medium transition-colors shadow-md"
          >
            Get Started for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <p className="mt-4 text-orange-100">No credit card required. 7-day free trial.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-gray-200 relative z-10">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Twitter className="h-6 w-6 text-orange-500" />
              <span className="text-xl font-bold">TweetGeni</span>
            </div>
            <p className="text-gray-600">AI-powered tweet generation to save you time and boost engagement.</p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 mb-4 md:mb-0">© 2023 TweetGeni. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
