import React, { type ReactNode } from 'react';
import 'primeflex/primeflex.css';                    // PrimeFlex for layout utilities
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // or any other PrimeReact theme
import 'primereact/resources/primereact.min.css';   // Core PrimeReact CSS
import 'primeicons/primeicons.css';                 // PrimeIcons
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

/**
 * Example Xmas-themed layout
 */
export default function XmasLayout({children}: {children: ReactNode}) {
    return (
        <div className="p-d-flex p-flex-column" style={{ minHeight: '100vh', backgroundColor: '#F6F1F1' }}>
            {/* En-tête / section héro */}
            <header
                className="p-d-flex p-jc-center p-ai-center"
                style={{
                    background: 'url("/annie-spratt-VDXtVYJVj7A-unsplash.jpg") center/cover no-repeat',
                    color: '#fff',
                    minHeight: '300px',
                    textAlign: 'center',
                    padding: '1rem'
                }}
            >
                <div>
                    <h1 style={{ fontSize: '3rem', textShadow: '2px 2px 5px rgba(0,0,0,0.5)' }}>Joyeux Noël 2024 !</h1>
                    <h2 style={{ fontSize: '2rem', textShadow: '2px 2px 5px rgba(0,0,0,0.5)' }}>Concours de dégustation de Champagne</h2>
                    <p style={{ fontSize: '1.25rem', textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
                        Je vous souhaite joie, paix et une saison remplie de magie.
                    </p>
                
                </div>
            </header>

            {/* Contenu principal */}
            <main className="p-d-flex p-flex-wrap p-jc-center p-m-4">
                <Card>
                {children}
                </Card>
            </main>

            {/* Pied de page */}
            <footer className="p-d-flex p-jc-center p-ai-center" style={{ backgroundColor: '#D72323', color: '#fff', padding: '1rem' }}>
                <p className="p-m-0">Joyeuses Fêtes 2024 ! Tous droits réservés Tony/Baguette/Alyosha/TotoBest.</p>
            </footer>
        </div>
    );
}
