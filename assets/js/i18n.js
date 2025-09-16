const translations = {
    en: {
        home: "Home",
        about: "About Us",
        services: "Services",
        blog: "Blog",
        contact: "Contact",
        heroTitle: "We Are a Team of Cloud Innovators",
        heroSubtitle: "Our mission is to help companies unlock the true potential of the cloud.",
        ourStory: "Our Story",
        storyContent1: "Cloudpeakify s.r.o. was founded in 2023 by Richard Skácel. With over 15 years of experience in IT, from server administration to complex cloud architectures, Richard decided to transform his knowledge and passion for technology into something more – a partnership for companies that want to grow and innovate.",
        storyContent2: "Richard is a certified Google Cloud Architect, an Azure specialist, and a VMware expert. His vision is simple: to provide not only top-tier technical expertise but also strategic consulting that helps companies find the right path in the digital world. Cloudpeakify s.r.o. is not just another IT company. It is a commitment to your success.",
        companyDetails: "Company Details",
        companyName: "Cloudpeakify s.r.o.",
        companyId: "IČO (Company ID): 21041342",
        vatId: "DIČ (VAT ID): CZ21041342",
        vatPayer: "We are VAT payers.",
        commercialRegister: "The entrepreneur is registered in the Commercial Register.",
        blogTitle: "Our Blog",
        blogSubtitle: "News, tips, and insights from the world of cloud.",
        readMore: "Read More",
        blogAdmin: "Blog Administration",
        postTitle: "Title",
        postContent: "Content",
        save: "Save",
        postsList: "Posts List",
        edit: "Edit",
        delete: "Delete",
        contactUs: "Contact Us",
        contactIntro: "Do you have any questions or are you interested in our services? Do not hesitate to contact us.",
        phone: "Phone",
        email: "Email",
        address: "Jičínská 226/16, Praha 3, Žižkov",
        billingAddress: "Billing Address",
        servicesTitle: "Our Services",
        servicesSubtitle: "We offer a wide range of services in cloud technologies."
    },
    cs: {
        home: "Domů",
        about: "O nás",
        services: "Služby",
        blog: "Blog",
        contact: "Kontakt",
        heroTitle: "Jsme Tým Cloudových Inovátorů",
        heroSubtitle: "Naše mise je pomáhat firmám odhalit skutečný potenciál cloudu.",
        ourStory: "Náš příběh",
        storyContent1: "Společnost Cloudpeakify s.r.o. byla založena v roce 2023 Richardem Skácelem. S více než 15 lety zkušeností v IT, od správy serverů až po komplexní cloudové architektury, se Richard rozhodl přetavit své znalosti a vášeň pro technologie v něco víc – v partnerství pro firmy, které chtějí růst a inovovat.",
        storyContent2: "Richard je certifikovaný Google Cloud Architect, specialista na Azure a expert na VMware. Jeho vize je jednoduchá: poskytovat nejen špičkové technické znalosti, ale také strategické poradenství, které firmám pomůže najít správnou cestu v digitálním světě. Cloudpeakify s.r.o. není jen další IT firma. Je to závazek k vašemu úspěchu.",
        companyDetails: "Firemní údaje",
        companyName: "Cloudpeakify s.r.o.",
        companyId: "IČO: 21041342",
        vatId: "DIČ: CZ21041342",
        vatPayer: "Jsme plátci DPH.",
        commercialRegister: "Podnikatel je zapsán v obchodním rejstříku.",
        blogTitle: "Náš Blog",
        blogSubtitle: "Novinky, tipy a postřehy ze světa cloudu.",
        readMore: "Přečíst více",
        blogAdmin: "Administrace Blogu",
        postTitle: "Titulek",
        postContent: "Obsah",
        save: "Uložit",
        postsList: "Seznam Článků",
        edit: "Upravit",
        delete: "Smazat",
        contactUs: "Kontaktujte nás",
        contactIntro: "Máte jakýkoliv dotaz nebo zájem o naše služby? Neváhejte nás kontaktovat.",
        phone: "Telefon",
        email: "E-mail",
        address: "Jičínská 226/16, Praha 3, Žižkov",
        billingAddress: "Fakturační adresa",
        servicesTitle: "Naše Služby",
        servicesSubtitle: "Nabízíme širokou škálu služeb v oblasti cloudových technologií."
    }
};

function setLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = translations[lang][key];
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const lang = localStorage.getItem('lang') || 'cs';
    setLanguage(lang);

    document.getElementById('lang-switcher').addEventListener('click', (e) => {
        e.preventDefault();
        const newLang = localStorage.getItem('lang') === 'cs' ? 'en' : 'cs';
        localStorage.setItem('lang', newLang);
        setLanguage(newLang);
    });
});
