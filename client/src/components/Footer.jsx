import React from "react";
import { Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h3 className="text-3xl font-light tracking-[0.3em] mb-6">KATENKELLY</h3>
              <p className="text-gray-300 leading-relaxed max-w-md">
                Crafting timeless elegance since our inception, KATENKELLY represents the perfect harmony
                between traditional artistry and contemporary design. Each piece tells a story of love,
                celebration, and cherished moments.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-medium mb-6 tracking-wide">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="/collections" className="text-gray-300 hover:text-amber-400 transition-colors">Collections</a></li>
              <li><a href="/custom-jewelry" className="text-gray-300 hover:text-amber-400 transition-colors">Custom Jewelry</a></li>
              <li><a href="/bridal" className="text-gray-300 hover:text-amber-400 transition-colors">Bridal Collection</a></li>
              <li><a href="/care-guide" className="text-gray-300 hover:text-amber-400 transition-colors">Care Guide</a></li>
              <li><a href="/size-guide" className="text-gray-300 hover:text-amber-400 transition-colors">Size Guide</a></li>
              <li><a href="/gift-cards" className="text-gray-300 hover:text-amber-400 transition-colors">Gift Cards</a></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-lg font-medium mb-6 tracking-wide">Customer Care</h4>
            <ul className="space-y-3 mb-6">
              <li><a href="/contact" className="text-gray-300 hover:text-amber-400 transition-colors">Contact Us</a></li>
              <li><a href="/shipping" className="text-gray-300 hover:text-amber-400 transition-colors">Shipping Info</a></li>
              <li><a href="/returns" className="text-gray-300 hover:text-amber-400 transition-colors">Returns & Exchanges</a></li>
              <li><a href="/warranty" className="text-gray-300 hover:text-amber-400 transition-colors">Warranty</a></li>
              <li><a href="/faq" className="text-gray-300 hover:text-amber-400 transition-colors">FAQ</a></li>
            </ul>

            <div className="space-y-2">
              <div className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-3" />
                <span>(+91) 123 456 7890</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-3" />
                <span>hello@katenkelly.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 KATENKELLY. All rights reserved. Crafted with love in India.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="/privacy" className="text-gray-400 hover:text-amber-400 transition-colors">Privacy Policy</a>
              <a href="/terms" className="text-gray-400 hover:text-amber-400 transition-colors">Terms of Service</a>
              <a href="/cookies" className="text-gray-400 hover:text-amber-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;