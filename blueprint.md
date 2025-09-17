# Blueprint: Cloudpeakify Web

## Přehled

Jednoduchá webová stránka pro společnost Cloudpeakify s.r.o. poskytující cloudové služby. Stránka je vícejazyčná (čeština, angličtina) a obsahuje informace o společnosti, službách, blog a kontaktní formulář.

## Styl a design

*   **Vzhled:** Dark mode s neonovými gradienty inspirovaný zencore.dev (skleněné panely, blur, výrazný kontrast).
*   **Písmo:** Sora (nadpisy) + Inter (texty).
*   **Komponenty:** Hero sekce s metrikami, modulární karty, procesní kroky, CTA bloky.
*   **Ikonografie:** Font Awesome pro kontakty, vlastní SVG loga certifikací.
*   **Mapa:** Leaflet.js.

## Funkce

*   **Vícejazyčnost:** Přepínání mezi češtinou a angličtinou.
*   **Blog:** Načítání příspěvků přes vlastní REST API (Node.js + PostgreSQL), vícejazyčný obsah.
*   **Administrace blogu:** Přihlášení e-mail/heslo, správa (vytváření, úpravy, mazání) vícejazyčných příspěvků.
*   **Kontaktní formulář:** Odesílání zpráv.
*   **Mapa:** Zobrazení sídla společnosti.
*   **Responzivita:** Přizpůsobení pro mobilní zařízení.

## Poslední změny

1.  Kompletní redesign frontendu (tmavý vizuál, nové sekce, CTA, reference) ve všech CZ/EN stránkách.
2.  Přechod z Firebase na vlastní backend (Node.js + Express + PostgreSQL) s REST API a JWT autentizací.
3.  Aktualizovaný administrační portál (formuláře, taby, hlášky) napojený na nové API.
4.  Vylepšený kontaktní formulář (lokální validace, více jazyků) a modernizovaný blog/detail šablony.
