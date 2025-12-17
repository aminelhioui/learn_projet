import React from 'react';
import './Footer.css';

// Composant Footer simple affichant des liens et la marque
// Utilisé sur les pages publiques et l'interface admin pour l'aspect visuel
const Footer = () => {
	return (
		<footer className="app-footer">
			<div className="footer-container">
				<div className="footer-brand">
					<h4>MonProjet</h4>
					<p>© {new Date().getFullYear()} MonProjet. Tous droits réservés.</p>
				</div>
				<div className="footer-links">
					{/* Liens internes vers des pages utiles */}
					<a href="/admin/dashboard">Tableau de bord</a>
					<a href="/unauthorized">Support</a>
					<a href="/login">Se connecter</a>
				</div>
				<div className="footer-social">
					{/* Liens externes / contact */}
					<a href="https://github.com" target="_blank" rel="noreferrer">Github</a>
					<a href="mailto:contact@example.com">Contact</a>
				</div>
			</div>
		</footer>
	);
};

export default Footer;

