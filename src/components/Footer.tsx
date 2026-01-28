
import React from 'react';
import { Facebook, Instagram, Youtube, Send } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#fafafa] pt-16 pb-8 px-6 lg:px-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-gray-200 pb-16">
        <div>
          <h4 className="font-bold text-sm mb-6 uppercase tracking-wider">Informations</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><a href="#" className="hover:text-black transition-colors">Politique de Confidentialité</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Conditions Générales de Vente</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Expédition & Livraison</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Politique de Retour</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-sm mb-6 uppercase tracking-wider">Service Client</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><a href="#" className="hover:text-black transition-colors">Boutique</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Suivi de Commande</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-sm mb-6 uppercase tracking-wider"> Pure Pefumes – L’Excellence Parfum</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            Parfums exclusifs, décantés premium et coffrets de luxe. Une sélection rigoureuse, choisie avec passion et expertise.
          </p>
          <div className="flex space-x-4 mt-6">
            <Facebook className="w-5 h-5 cursor-pointer hover:text-gray-600 transition-colors" />
            <Instagram className="w-5 h-5 cursor-pointer hover:text-gray-600 transition-colors" />
            <Youtube className="w-5 h-5 cursor-pointer hover:text-gray-600 transition-colors" />
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-400 uppercase tracking-[0.2em]">
        <p>© 2025 - Pure Pefumes</p>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">

        </div>
      </div>
    </footer>
  );
};

export default Footer;
