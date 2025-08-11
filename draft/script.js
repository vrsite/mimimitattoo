// Меню
const burger = document.getElementById('burger');
const sideMenu = document.getElementById('sideMenu');
const closeMenu = document.getElementById('closeMenu');
const menuBackdrop = document.getElementById('menuBackdrop');

const menuLinks = sideMenu.querySelectorAll('ul li a');

function isMobileScreen() {
  return window.matchMedia("(max-width: 900px)").matches;
}

burger.addEventListener('click', () => {
  sideMenu.classList.add('open');
  menuBackdrop.classList.add('open');

  if (isMobileScreen()) {
    document.body.style.overflow = 'hidden';
  }

  burger.classList.add('hidden');
});

document.addEventListener('click', (event) => {
  if (sideMenu.classList.contains('open')) {
    if (event.target !== burger && !burger.contains(event.target) &&
        event.target !== sideMenu && !sideMenu.contains(event.target) &&
        event.target !== closeMenu && !closeMenu.contains(event.target)) {
      closeSideMenu();
    }
  }
});

closeMenu.addEventListener('click', closeSideMenu);

menuLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        if (!link.closest('.lang-switch')) {
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            closeSideMenu();
        }
    });
});

function closeSideMenu() {
  sideMenu.classList.remove('open');
  menuBackdrop.classList.remove('open');

  if (isMobileScreen()) {
    document.body.style.overflow = '';
  }

  burger.classList.remove('hidden');
}

const ruBtn = document.getElementById('ruBtn');
const enBtn = document.getElementById('enBtn');
const translations = {
  ru: {
    main_title: "MIMIMI TATTOO",
    main_subtitle: "искусство на коже, созданное с любовью",
    main_cta: "Записаться",
    menu_portfolio: "Портфолио",
    menu_services: "Услуги",
    menu_about: "Обо мне",
    menu_process: "Процесс",
    menu_signup: "Запись",
    menu_contacts: "Контакты",
    menu_faq: "FAQ",
    menu_reviews: "Отзывы",
    services_title: "Услуги",
    service_aqua_title: "AQUA",
    service_aqua_desc: "AQUA — это изысканный стиль татуировки, вдохлённый акварельной живописью. Лёгкие, полупрозрачные оттенки, плавные переходы цвета и воздушные композиции делают такие татуировки по-настоящему уникальными. AQUA идеально подходит для тех, кто ценит нежность, художественность и индивидуальность в тату-искусстве.",
    service_coverup_title: "COVER UP",
    service_coverup_desc: "COVER UP — профессиональное перекрытие старых или неудачных татуировок. Я помогу полностью скрыть прежний рисунок, разработав новый эскиз с учётом ваших пожеланий и особенностей предыдущей работы. COVER UP — это возможность начать с чистого листа и получить татуировку, которой вы действительно будете гордиться.",
    service_line_title: "LINE",
    service_line_desc: "LINE — стиль минималистичных татуировок, выполненных тонкими, чёткими линиями. Такой подход идеально подходит для создания лаконичных, элегантных и современных изображений: геометрия, абстракция, контурные рисунки. LINE — выбор для тех, кто ценит простоту и стиль.",
    service_mini_title: "MINI",
    service_mini_desc: "MINI — маленькие татуировки с особым смыслом. Компактные, аккуратные и ненавязчивые, они отлично подойдут для первого тату-опыта или для тех, кто предпочитает деликатные акценты. MINI — это способ выразить себя с помощью небольшого, но значимого рисунка.",
    service_permanent_title: "PERMANENT",
    service_permanent_desc: "PERMANENT — услуга перманентного макияжа: стойкое оформление бровей, губ или век. Перманентный макияж позволяет всегда выглядеть ухоженно и уверенно, экономя время на ежедневном нанесении косметики.",
    service_piercing_title: "PIERCING",
    service_piercing_desc: "PIERCING — профессиональное прокалывание различных частей тела с установкой украшений. Гарантирую стерильность, безопасность и индивидуальный подход к каждому клиенту. Украсьте себя стильно и безопасно!",
    portfolio_title: "Портфолио",
    reviews_title: "Отзывы",
    reviews_placeholder: "Отзывы появятся скоро!",
    view_all_portfolio: "Показать все работы",
    hide_all_portfolio: "Скрыть все работы",
    about_p1: "Привет, меня зовут Kris.",
    about_p2: "Я профессиональный тату-мастер, специалист по пирсингу и перманентному макияжу с семилетним опытом. Для меня это не просто дело жизни — это искусство, в котором я раскрываю характер, стиль и внутренний мир каждого клиента.",
    about_p3: "Вдохновляюсь путешествиями, современным искусством и уникальностью каждого, кто доверяет мне свою идею. Каждый проект — это индивидуальный подход, внимание к деталям и стремление создать нечто по-настоящему особенное.",
    about_p4: "Высокие стандарты гигиены, стерильность и забота о вашем спокойствии — мой неизменный приоритет.",
    about_p5: "Если вы цените эстетику, индивидуальность и профессионализм, я буду рада воплотить вашу идею в жизнь.",
    process_main_title: "Процесс создания вашей уникальной истории",
    process_intro_p1: "Мой подход — это чёткая структура, внимание к деталям и уважение к вашим ожиданиям. Каждый этап выстроен так, чтобы результат был максимально качественным и отражал именно ваш запрос.",
    process_step1_title: "1. Обсуждение и разработка эскиза",
    process_step1_desc: "Мы определяем ваши пожелания, стиль и основные идеи. Я уточняю детали, предлагаю профессиональные решения и разрабатываю индивидуальный эскиз, который согласовывается с вами до полного утверждения.",
    process_step2_title: "2. Подготовка",
    process_step2_desc: "Перед началом процедуры тщательно подготавливаю рабочее пространство, использую только одноразовые и стерильные материалы. Все этапы подготовки прозрачны и соответствуют высоким стандартам безопасности.",
    process_step3_title: "3. Реализация",
    process_step3_desc: "После согласования эскиза начинается основной этап — нанесение татуировки, пирсинга или перманентного макияжа. Работаю аккуратно, с вниманием к каждой детали, чтобы результат был точным и эстетичным.",
    process_step4_title: "4. Рекомендации по уходу",
    process_step4_desc: "По завершении процедуры вы получаете подробные инструкции по уходу, а также специальную заживляющую плёнку — она уже включена в стоимость. Это делает процесс восстановления лёгким и спокойным. Я всегда на связи, чтобы ответить на ваши вопросы и поддержать на этапе заживления.",
    process_outro_p1: "Моя задача — чтобы каждый этап был понятным, а результат радовал вас каждый день.",
    contact_phone_label: "Телефоны:",
    contact_phone_number_ua: "+380 96 515 78 90 (UA)",
    contact_phone_number_irl: "+353 87 716 79 33 (IRL)",
    contact_email_label: "Почта:",
    contact_email_address: "nika889list.ru@gmail.com",
    contact_social_label: "Мы в соцетях:",
    contact_hours_label: "Часы работы:",
    contact_hours_text: "Пн-Пт: 10:00 - 19:00<br>Сб: 11:00 - 17:00<br>Вс: Выходной",
    signup_description_bot_info: "Для удобной записи на сеанс, получения ответов на часто задаваемые вопросы и просмотра контактов, воспользуйтесь нашим Telegram-ботом. Вы можете начать диалог прямо здесь:",
    chat_widget_title: "Чат с Mimimi Tattoo Bot",
    chat_input_placeholder: "Напишите сообщение...",
    chat_connection_error: "Ошибка подключения к боту. Пожалуйста, попробуйте позже.",
    chat_bot_unavailable: "Ошибка: Бот недоступен. Пожалуйста, попробуйте позже.",
    show_all_reviews: "Показать все отзывы",
    hide_all_reviews: "Скрыть отзывы",
    faq_general_title: "Общие вопросы о татуировках",
    faq_piercing_title: "Вопросы о пирсинге",
    faq_permanent_title: "Вопросы о перманентном макияже",
  },
  en: {
    main_title: "MIMIMI TATTOO",
    main_subtitle: "art on skin, created with love",
    main_cta: "Book now",
    menu_portfolio: "Portfolio",
    menu_services: "Services",
    menu_about: "About me",
    menu_process: "Process",
    menu_signup: "Booking",
    menu_contacts: "Contacts",
    menu_faq: "FAQ",
    menu_reviews: "Reviews",
    services_title: "Services",
    service_aqua_title: "AQUA",
    service_aqua_desc: "AQUA is a sophisticated tattoo style inspired by watercolor painting. Light, translucent shades, smooth color transitions, and airy compositions make these tattoos truly unique. AQUA is perfect for those who appreciate delicacy, artistry, and individuality in tattoo art.",
    service_coverup_title: "COVER UP",
    service_coverup_desc: "COVER UP is a professional service for covering up old or unsuccessful tattoos. I will help you completely conceal the previous design by creating a new sketch tailored to your wishes and the specifics of the old tattoo. COVER UP is your chance to start fresh and get a tattoo you can truly be proud of.",
    service_line_title: "LINE",
    service_line_desc: "LINE is a minimalist tattoo style created with thin, precise lines. This approach is ideal for elegant, modern, and concise designs: geometry, abstraction, and outline drawings. LINE is the choice for those who value simplicity and style.",
    service_mini_title: "MINI",
    service_mini_desc: "MINI are small tattoos with special meaning. Compact, neat, and subtle, they are perfect for a first tattoo experience or for those who prefer delicate accents. MINI is a way to express yourself with a small but meaningful design.",
    service_permanent_title: "PERMANENT",
    service_permanent_desc: "PERMANENT is a permanent makeup service: long-lasting enhancement of eyebrows, lips, or eyelids. Permanent makeup allows you to always look well-groomed and confident, saving time on daily makeup routines.",
    service_piercing_title: "PIERCING",
    service_piercing_desc: "PIERCING is a professional body piercing service with jewelry installation. I guarantee sterility, safety, and a personalized approach for every client. Adorn yourself stylishly and safely!",
    portfolio_title: "Portfolio",
    reviews_title: "Reviews",
    reviews_placeholder: "Reviews will appear soon!",
    view_all_portfolio: "VIEW ALL WORKS",
    hide_all_portfolio: "HIDE ALL WORKS",
    about_p1: "Hello, my name is Kris.",
    about_p2: "I am a professional tattoo artist, piercing specialist, and permanent makeup expert with seven years of experience. For me, this is not just a career — it is an art form where I reveal the character, style, and inner world of each client.",
    about_p3: "I draw inspiration from travel, contemporary art, and the uniqueness of everyone who entrusts me with their ideas. Every project — it is an individual approach, attention to detail, and a desire to create something truly special.",
    about_p4: "High standards of hygiene, sterility, and care for your peace of mind are my unwavering priorities.",
    about_p5: "If you value aesthetics, individuality, and professionalism, I will be happy to bring your idea to life.",
    process_main_title: "The Process of Creating Your Unique Story",
    process_intro_p1: "My approach is clear structure, attention to detail, and respect for your expectations. Each stage is designed to ensure the highest quality result that truly reflects your vision.",
    process_step1_title: "1. Consultation and Design Development",
    process_step1_desc: "We define your wishes, style, and main ideas. I clarify the details, offer professional solutions, and create a custom design, which is finalized together with you.",
    process_step2_title: "2. Preparation",
    process_step2_desc: "Before the procedure, I carefully prepare the workspace, using only single-use and sterile materials. All stages of preparation are transparent and meet the highest safety standards.",
    process_step3_title: "3. Creation",
    process_step3_desc: "Once the design is approved, the main stage begins — the application of your tattoo, piercing, or permanent makeup. I work with precision and attention to every detail to ensure the result is both accurate and aesthetically pleasing.",
    process_step4_title: "4. Aftercare Recommendations",
    process_step4_desc: "At the end of your session, you receive detailed aftercare instructions, as well as a special healing film — already included in the price. This makes the healing process easy and stress-free. I am always available to answer your questions and support you during recovery.",
    process_outro_p1: "My goal is to make every step clear and the result something that brings you joy every day.",
    contact_phone_label: "Phone:",
    contact_phone_number_ua: "+380 96 515 78 90 (UA)",
    contact_phone_number_irl: "+353 87 716 79 33 (IRL)",
    contact_email_label: "Email:",
    contact_email_address: "nika889list.ru@gmail.com",
    contact_social_label: "Social Media:",
    contact_hours_label: "Working Hours:",
    contact_hours_text: "Mon-Fri: 10:00 - 19:00<br>Sat: 11:00 - 17:00<br>Sun: Closed",
    signup_description_bot_info: "For convenient booking, FAQ, and contacts, use our Telegram bot. You can start chatting right here:",
    chat_widget_title: "Chat with Mimimi Tattoo Bot",
    chat_input_placeholder: "Type a message...",
    chat_connection_error: "Error connecting to the bot. Please try again later.",
    chat_bot_unavailable: "Error: Bot is unavailable. Please try again later.",
    faq_general_title: "General Tattoo Questions",
    faq_piercing_title: "Piercing Questions",
    faq_permanent_title: "Permanent Makeup Questions",
  }
};

let currentLang = 'ru';

function setLanguage(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (el.classList.contains('tab-button')) {
      return;
    }
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
      chatInput.placeholder = translations[currentLang]['chat_input_placeholder'];
  }

  const uaPhoneLink = document.querySelector('.contact-phone-link[href="tel:+380965157890"]');
  if (uaPhoneLink) {
    uaPhoneLink.innerHTML = `<i class="fas fa-phone"></i> ${translations[currentLang]['contact_phone_number_ua']}`;
  }
  const irlPhoneLink = document.querySelector('.contact-phone-link[href="tel:+353877167933"]');
  if (irlPhoneLink) {
    irlPhoneLink.innerHTML = `<i class="fas fa-phone"></i> ${translations[currentLang]['contact_phone_number_irl']}`;
  }
  const emailLink = document.querySelector('.contact-email-link[href="mailto:nika889list.ru@gmail.com"]');
  if (emailLink) {
    emailLink.innerHTML = `<i class="fas fa-envelope"></i> ${translations[currentLang]['contact_email_address']}`;
  }

  document.querySelectorAll('.service-modal-backdrop.active .service-modal-content').forEach(modalContent => {
      const modalTitleElement = modalContent.querySelector('.service-modal-title');
      const modalDescElement = modalContent.querySelector('.service-modal-description');

      if (modalTitleElement && modalDescElement) {
          const serviceKey = modalTitleElement.getAttribute('data-service-key');
          if (serviceKey) {
              modalTitleElement.textContent = translations[currentLang][`service_${serviceKey}_title`];
              modalDescElement.textContent = translations[currentLang][`service_${serviceKey}_desc`];
          }
      }
  });

  const viewMoreBtn = document.getElementById('viewMorePortfolioBtn');
  const hideAllBtn = document.getElementById('hideAllPortfolioBtn');
  if (viewMoreBtn) {
      viewMoreBtn.textContent = translations[currentLang]['view_all_portfolio'];
  }
  if (hideAllBtn) {
      hideAllBtn.textContent = translations[currentLang]['hide_all_portfolio'];
  }

  updateReviewsCarouselContent();

  renderFaq();

    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
}

ruBtn.addEventListener('click', () => {
  ruBtn.classList.add('active');
  enBtn.classList.remove('active');
  setLanguage('ru');
});
enBtn.addEventListener('click', () => {
  enBtn.classList.add('active');
  ruBtn.classList.remove('active');
  setLanguage('en');
});

const reviewsData = [
  {
    name: "Aisling O'Connell",
    text: {
      ru: "Моя новая татуировка просто потрясающая! Крис проявила невероятный талант и внимание к деталям. Студия очень чистая и уютная. Однозначно рекомендую!",
      en: "My new tattoo is absolutely stunning! Kris showed incredible talent and and comfortable. Definitely recommend!"
    }
  },
  {
    name: "Liam Murphy",
    text: {
      ru: "Делал пирсинг, все прошло быстро и без проблем. Мастер была очень профессиональна и дала отличные советы по уходу. Очень доволен результатом!",
      en: "Had a piercing done, it was quick and seamless. The artist was very professional and gave great aftercare advice. Very pleased with the outcome!"
    }
  },
  {
    name: "Siobhán Doyle",
    text: {
      ru: "Перманентный макияж моих губ выглядит так естественно и красиво. Крис - настоящий художник, она сделала именно то, что я хотела. Большое спасибо!",
      en: "My permanent lip makeup looks so natural and beautiful. Kris is a true artist; she did exactly what I wanted. Thank you so much!"
    }
  },
  {
    name: "Cillian Walsh",
    text: {
      ru: "Я давно хотел татуировку в стиле блэкворк, и Крис превзошла все мои ожидания. Четкие линии и глубокий черный цвет. Я впечатлен мастерством!",
      en: "I've wanted a blackwork tattoo for a long long time, and Kris exceeded all my expectations. Crisp lines and deep black. I'm truly impressed by the artistry!"
    }
  },
  {
    name: "Niamh Kelly",
    text: {
      ru: "Обратилась за перекрытием старой, неудачной татуировки. Крис сделала невозможное! Теперь у меня прекрасный новый дизайн, которым я горжусь. Не могу поверить, как это здорово!",
      en: "I came in to get an old, failed tattoo covered up. Kris did the impossible! Now I have a beautiful new design that I'm proud to show off. I can't believe how amazing it looks!"
    }
  },
  {
    name: "Brendan Daly",
    text: {
      ru: "Отличный опыт с мини-тату. Работа сделана очень аккуратно и с душой. Крис очень дружелюбна и внимательна. Результат точно такой, как я представлял.",
      en: "Great experience with my mini-tattoo. The work was done very precisely and with passion. Kris is very friendly and attentive. The result is exactly as I imagined."
    }
  },
  {
    name: "Aoife Ryan",
    text: {
      ru: "Моя первая татуировка, и я так счастлива, что выбрала Mimimitattoo. Крис была невероятно терпелива и помогла мне чувствовать себя комфортно. Очень рекомендую для первого раза!",
      en: "My first tattoo, and I'm so happy I chose Mimimitattoo. Kris was incredibly patient and made me feel so comfortable. Highly recommend for a first-timer!"
    }
  },
  {
    name: "Павел К.",
    text: {
      ru: "Уже не первый раз обращаюсь к Крис. Всегда радует её профессионализм и креативный подход. Каждая новая татуировка становится ещё лучше предыдущей. Доверяю только ей!",
      en: "This isn't my first time coming to Kris. Her professionalism and creative approach always impress me. Each new tattoo is even better than the last. I only trust her!"
    }
  },
  {
    name: "Ольга Н.",
    text: {
      ru: "Хочу выразить огромную благодарность за новый пирсинг. Все сделано чисто, быстро и безболезненно. Очень рада, что обратилась именно сюда. Теперь у меня классное украшение, и всё прекрасно заживает.",
      en: "I want to express huge gratitude for my new piercing. Everything was done cleanly, quickly, and painlessly. I'm very glad I chose this place. Now I have a cool piece of jewelry, and it's healing perfectly."
    }
  },
  {
    name: "Виктор А.",
    text: {
      ru: "Записывался на сеанс татуировки по рекомендации друга. Крис — мастер своего дела! Эскиз был разработан точно по моим пожеланиям, а реализация просто на высоте. Тату выглядит потрясающе.",
    en: "Booked a tattoo session on a friend's recommendation. Kris is a master of her craft! The design was developed exactly to my wishes, and the execution is simply top-notch. The tattoo looks amazing."
    }
  },
  {
    name: "София Л.",
    text: {
      ru: "Моя акварельная татуировка получилась именно такой, как я мечтала — нежной, воздушной и уникальной. Крис обладает невероятным художественным вкусом. Это не просто тату, это настоящее произведение искусства.",
      en: "My watercolor tattoo turned out exactly as I dreamed — delicate, airy, and unique. Kris has incredible artistic taste. It's not just a tattoo; it's a true work of art."
    }
  },
  {
    name: "Глеб З.",
    text: {
      ru: "Делал небольшую татуировку на запястье. Крис очень аккуратная, работа сделана ювелирно. Результатом полностью доволен, выглядит очень стильно. Процесс был очень комфортным.",
      en: "Great experience with my mini-tattoo. The work was done very precisely and with passion. Kris is very friendly and attentive. The result is exactly as I imagined."
    }
  },
  {
    name: "Ксения Р.",
    text: {
      ru: "Прекрасный мастер и чудесная атмосфера! Перманентный макияж губ преобразил мое лицо, теперь всегда выгляжу свежо и ухоженно. Очень благодарна за профессионализм и индивидуальный подход.",
      en: "Wonderful artist and lovely atmosphere! Permanent lip makeup transformed my face; now I always look fresh and well-groomed. Very grateful for the professionalism and individual approach."
    }
  },
  {
    name: "Артем Ф.",
    text: {
      ru: "Решил сделать свою первую татуировку и выбрал Mimimitattoo. Ни на секунду не пожалел. Крис очень подробно объяснила весь процесс, развеяла все страхи. Татуировка идеальна!",
      en: "Decided to get my first tattoo and chose Mimimitattoo. Didn't regret it for a second. Kris explained the whole process in detail, dispelled all fears. The tattoo is perfect!"
    },
  },
  {
    name: "Надежда В.",
    text: {
      ru: "Сделала у Крис перекрытие старого шрама татуировкой. Результат просто потрясающий, теперь вместо некрасивого следа у меня красивый рисунок, который я гордо показываю. Спасибо за новую уверенность!",
      en: "Had Kris cover up an old scar with a tattoo. The result is simply amazing; now instead of an unsightly mark, I have a beautiful design that I proudly show off. Thank you for my newfound confidence!"
    }
  }
];

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxPrevPreview = document.getElementById('lightboxPrevPreview');
const lightboxNextPreview = document.getElementById('lightboxNextPreview');
const burgerButton = document.getElementById('burger');

let currentPortfolioIndex = 0;
let allPortfolioImages = [];

function updateLightboxImages() {
    if (allPortfolioImages.length === 0) {
        lightboxImg.src = '';
        lightboxPrevPreview.style.backgroundImage = 'none';
        lightboxNextPreview.style.backgroundImage = 'none';
        return;
    }

    lightboxImg.src = allPortfolioImages[currentPortfolioIndex].src;

    const prevIndex = (currentPortfolioIndex - 1 + allPortfolioImages.length) % allPortfolioImages.length;
    const nextIndex = (currentPortfolioIndex + 1) % allPortfolioImages.length;

    lightboxPrevPreview.style.backgroundImage = `url(${allPortfolioImages[prevIndex].src})`;
    lightboxNextPreview.style.backgroundImage = `url(${allPortfolioImages[nextIndex].src})`;
}

function openLightbox(index) {
  currentPortfolioIndex = index;
  updateLightboxImages();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  burgerButton.classList.add('hidden');
}
function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  lightboxPrevPreview.style.backgroundImage = 'none';
  lightboxNextPreview.style.backgroundImage = 'none';
  burgerButton.classList.remove('hidden');
}
function showPrevPortfolio() {
  currentPortfolioIndex = (currentPortfolioIndex - 1 + allPortfolioImages.length) % allPortfolioImages.length;
  updateLightboxImages();
}
function showNextPortfolio() {
  currentPortfolioIndex = (currentPortfolioIndex + 1) % allPortfolioImages.length;
  updateLightboxImages();
}

document.addEventListener('DOMContentLoaded', () => {
    const featuredGalleryImgs = document.querySelectorAll('#featuredPortfolioGallery img');
    const fullGalleryImgs = document.querySelectorAll('#fullPortfolioGallery img');
    allPortfolioImages = Array.from(featuredGalleryImgs).concat(Array.from(fullGalleryImgs));

    allPortfolioImages.forEach((img, idx) => {
        img.addEventListener('click', () => openLightbox(idx));
    });
});


lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrevPortfolio);
lightboxNext.addEventListener('click', showNextPortfolio);

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPrevPortfolio();
  if (e.key === 'ArrowRight') showNextPortfolio();
});


const serviceCards = document.querySelectorAll('.service-card');
const serviceModalsContainer = document.getElementById('serviceModalsContainer');

const serviceImages = {
  aqua: 'akva.PNG',
  coverup: 'coverup.PNG',
  line: 'line.JPG',
  mini: 'mini.jpg',
  permanent: 'permanent.png',
  piercing: 'PIERCING.jpg'
};

function createServiceModal(serviceKey) {
    const titleKey = `service_${serviceKey}_title`;
    const descKey = `service_${serviceKey}_desc`;
    const imageUrl = `images/${serviceImages[serviceKey]}`;

    const modalBackdrop = document.createElement('div');
    modalBackdrop.classList.add('service-modal-backdrop');
    modalBackdrop.id = `modal-${serviceKey}`;

    modalBackdrop.innerHTML = `
        <div class="service-modal-content">
            <button class="service-modal-close" data-dismiss-modal="${serviceKey}">&times;</button>
            <img src="${imageUrl}" alt="${translations[currentLang][titleKey]}" class="service-modal-image">
            <h3 class="service-modal-title" data-service-key="${serviceKey}">${translations[currentLang][titleKey]}</h3>
            <p class="service-modal-description">${translations[currentLang][descKey]}</p>
        </div>
    `;
    return modalBackdrop;
}

document.addEventListener('DOMContentLoaded', () => {
    serviceCards.forEach(card => {
        const serviceKey = card.getAttribute('data-service-key');
        if (serviceKey && serviceImages[serviceKey]) {
            const modal = createServiceModal(serviceKey);
            serviceModalsContainer.appendChild(modal);
        }
    });
});


serviceCards.forEach(card => {
    card.addEventListener('click', () => {
        const serviceKey = card.getAttribute('data-service-key');
        const modal = document.getElementById(`modal-${serviceKey}`);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            burgerButton.classList.add('hidden');
            const modalTitleElement = modal.querySelector('.service-modal-title');
            const modalDescElement = modal.querySelector('.service-modal-description');
            if (modalTitleElement && modalDescElement) {
                modalTitleElement.textContent = translations[currentLang][`service_${serviceKey}_title`];
                modalDescElement.textContent = translations[currentLang][`service_${serviceKey}_desc`];
            }
        }
    });
});

serviceModalsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('service-modal-close')) {
        const serviceKeyToClose = event.target.getAttribute('data-dismiss-modal');
        const modalToClose = document.getElementById(`modal-${serviceKeyToClose}`);
        if (modalToClose) {
            modalToClose.classList.remove('active');
            document.body.style.overflow = '';
            burgerButton.classList.remove('hidden');
        }
    }
    else if (event.target.classList.contains('service-modal-backdrop')) {
        event.target.classList.remove('active');
        document.body.style.overflow = '';
        burgerButton.classList.remove('hidden');
    }
});

document.addEventListener('keydown', (event) => {
  const activeServiceModal = document.querySelector('.service-modal-backdrop.active');
  const activeLightbox = document.querySelector('.lightbox.active');

  if (event.key === 'Escape') {
    if (activeServiceModal) {
      activeServiceModal.classList.remove('active');
      document.body.style.overflow = '';
      burgerButton.classList.remove('hidden');
    } else if (activeLightbox) {
      closeLightbox();
    }
  }
});

const viewMorePortfolioBtn = document.getElementById('viewMorePortfolioBtn');
const fullPortfolioGallery = document.getElementById('fullPortfolioGallery');
const hideAllPortfolioBtn = document.getElementById('hideAllPortfolioBtn');
const portfolioSection = document.getElementById('portfolio');

if (viewMorePortfolioBtn && fullPortfolioGallery && hideAllPortfolioBtn) {
    viewMorePortfolioBtn.addEventListener('click', () => {
        fullPortfolioGallery.style.display = 'block';
        viewMorePortfolioBtn.style.display = 'none';
        hideAllPortfolioBtn.style.display = 'inline-block';
        if (portfolioSection) {
            portfolioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

if (hideAllPortfolioBtn && fullPortfolioGallery && viewMorePortfolioBtn) {
    hideAllPortfolioBtn.addEventListener('click', () => {
        fullPortfolioGallery.style.display = 'none';
        viewMorePortfolioBtn.style.display = 'inline-block';
        hideAllPortfolioBtn.style.display = 'none';
        if (portfolioSection) {
            portfolioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

const openChatBtn = document.getElementById('openChatBtn');
const telegramChatWidget = document.getElementById('telegramChatWidget');
const closeChatBtn = document.getElementById('closeChatBtn');
const chatInput = document.getElementById('chatInput');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const chatMessages = document.getElementById('chatMessages');
const chatButtons = document.getElementById('chatButtons');

const BOT_SERVER_URL = 'https://telegram-chat-backend-dz5f.onrender.com';

let socket;
let isInitialBotMessage = true;

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (!window.io) {
            const script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.7.5/socket.io.min.js";
            script.onload = () => {
                initializeChatWidgetSocket();
            };
            document.head.appendChild(script);
        } else {
            initializeChatWidgetSocket();
        }
    }, 500);
});

function initializeChatWidgetSocket() {
    if (socket && socket.connected) {
        return;
    }

    socket = io(BOT_SERVER_URL);

    socket.on('connect', () => {
        console.log('Socket.IO connected!');
        if (telegramChatWidget.classList.contains('active')) {
             sendMessageToBot('/start', false);
        }
    });

    socket.on('disconnect', () => {
        console.log('Socket.IO disconnected.');
    });

    socket.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error);
        addMessage(translations[currentLang]['chat_connection_error'] || 'Ошибка подключения к боту. Пожалуйста, попробуйте позже.', 'bot');
    });

    socket.on('botMessage', (data) => {
        if (isInitialBotMessage) {
            chatMessages.innerHTML = '';
            isInitialBotMessage = false;
        }
        addMessage(data.text, 'bot');
        updateChatButtons(data.buttons);
    });

    socket.on('clearLastButtons', () => {
        updateChatButtons([]);
    });

    socket.on('showAlert', (data) => {
    });
}

function addMessage(text, sender) {
    if (!chatMessages) {
        console.error('Элемент chatMessages не найден.');
        return;
    }

    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', `${sender}-message`);
    messageElement.innerHTML = text.replace(/\n/g, '<br>');
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function updateChatButtons(buttons) {
    if (!chatButtons) {
        console.error('Элемент chatButtons не найден.');
        return;
    }

    chatButtons.innerHTML = '';
    if (buttons && buttons.length > 0) {
        buttons.forEach(row => {
            const buttonRowDiv = document.createElement('div');
            buttonRowDiv.classList.add('chat-button-row');
            row.forEach(buttonData => {
                const buttonElement = document.createElement('button');
                buttonElement.classList.add('chat-button');
                buttonElement.textContent = buttonData.text;
                buttonElement.dataset.callback = buttonData.callback_data;
                buttonRowDiv.appendChild(buttonElement);
            });
            chatButtons.appendChild(buttonRowDiv);
        });
        chatButtons.style.display = 'flex';
    } else {
        chatButtons.style.display = 'none';
    }
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

openChatBtn.addEventListener('click', () => {
    telegramChatWidget.classList.add('active');
    if (isMobileScreen()) {
        document.body.style.overflow = 'hidden';
    }

    chatMessages.innerHTML = `
        <div class="chat-message bot-message">
            <span data-i18n="chat_welcome_message">${translations[currentLang]['chat_welcome_message'] || 'Здравствуйте! Я Mimimi Tattoo Bot. Чем могу помочь?'}</span>
        </div>
    `;
    isInitialBotMessage = true;
    chatInput.value = '';
    updateChatButtons([]);

    if (!socket || !socket.connected) {
        initializeChatWidgetSocket();
    } else {
        sendMessageToBot('/start', false);
    }
});

closeChatBtn.addEventListener('click', () => {
    telegramChatWidget.classList.remove('active');
    if (isMobileScreen()) {
        document.body.style.overflow = '';
    }
    if (socket && socket.connected) {
        socket.disconnect();
    }
});

async function sendMessageToBot(messageText, isCallback = false) {
    if (!socket || !socket.connected) {
        addMessage(translations[currentLang]['chat_bot_unavailable'] || 'Ошибка: Бот недоступен. Пожалуйста, попробуйте позже.', 'bot');
        return;
    }

    if (!isCallback) {
        addMessage(messageText, 'user');
    }

    chatInput.value = '';
    socket.emit('webMessage', { message: messageText, isCallback: isCallback });
}

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && chatInput.value.trim() !== '') {
        sendMessageToBot(chatInput.value);
    }
});

sendMessageBtn.addEventListener('click', () => {
    if (chatInput.value.trim() !== '') {
        sendMessageToBot(chatInput.value);
    }
});

chatButtons.addEventListener('click', (e) => {
    if (e.target.classList.contains('chat-button')) {
        const callbackData = e.target.dataset.callback;
        const buttonText = e.target.textContent;

        addMessage(buttonText, 'user');
        sendMessageToBot(callbackData, true);
    }
});

const reviewsCarousel = document.getElementById('reviewsCarousel');
const carouselInner = document.getElementById('carouselInner');
const carouselPrev = document.getElementById('carouselPrev');
const carouselNext = document.getElementById('carouselNext');
const carouselDots = document.getElementById('carouselDots');
const reviewsColumn = document.getElementById('reviews-column');

let currentReviewIndex = 0;
let autoSlideInterval;

const borderRadiusShapes = [
    '60% 40% 40% 60% / 60% 60% 40% 40%',
    '40% 60% 60% 40% / 40% 40% 60% 60%',
    '55% 45% 45% 55% / 65% 35% 65% 35%',
    '45% 55% 55% 45% / 35% 65% 35% 65%',
    '50% 50% 30% 70% / 70% 30% 70% 30%'
];

function createReviewCard(review, lang) {
  const card = document.createElement('div');
  card.classList.add('review-card');
  card.innerHTML = `
    <h3>${review.name}</h3>
    <p>${review.text[lang]}</p>
  `;
  return card;
}

function updateReviewsCarouselContent() {
    carouselInner.innerHTML = '';
    if (reviewsData.length === 0) {
        carouselInner.innerHTML = `<div class="review-placeholder">${translations[currentLang]['reviews_placeholder']}</div>`;
        carouselPrev.style.display = 'none';
        carouselNext.style.display = 'none';
        if (reviewsColumn) {
            reviewsColumn.style.borderRadius = '15px';
        }
        return;
    } else {
        carouselPrev.style.display = '';
        carouselNext.style.display = '';
    }

    reviewsData.forEach((review, index) => {
        const carouselCard = createReviewCard(review, currentLang);
        carouselInner.appendChild(carouselCard);
    });

    showCurrentReview();
    resetAutoSlide();
}

function showCurrentReview() {
    const cards = carouselInner.querySelectorAll('.review-card');
    if (cards.length === 0) return;

    currentReviewIndex = (currentReviewIndex % cards.length + cards.length) % cards.length;

    cards.forEach((card) => {
        card.classList.remove('active');
    });

    cards[currentReviewIndex].classList.add('active');

    if (cards[currentReviewIndex]) {
        const cardWidth = cards[currentReviewIndex].offsetWidth;
        carouselInner.style.transform = `translateX(-${currentReviewIndex * cardWidth}px)`;
    }

    if (reviewsColumn && !isMobileScreen()) {
        const shapeIndex = currentReviewIndex % borderRadiusShapes.length;
        reviewsColumn.style.borderRadius = borderRadiusShapes[shapeIndex];
    } else if (reviewsColumn && isMobileScreen()) {
        reviewsColumn.style.borderRadius = '15px';
    }
}

function nextReview() {
  currentReviewIndex++;
  showCurrentReview();
}

function prevReview() {
  currentReviewIndex--;
  showCurrentReview();
}

function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(nextReview, 5000);
}

function initReviewsCarousel() {
  updateReviewsCarouselContent();

  carouselPrev.addEventListener('click', prevReview);
  carouselNext.addEventListener('click', nextReview);

  window.addEventListener('resize', () => {
      showCurrentReview();
  });
}


const generalFaqData = [
    {
        question: {
            ru: "Входит ли заживляющая пленка в стоимость татуировки?",
            en: "Is the healing film included in the tattoo price?"
        },
        answer: {
            ru: "Да, заживляющая пленка включена в стоимость каждой татуировки. Я забочусь о том, чтобы процесс заживления был максимально комфортным и безопасным для вас.",
            en: "Yes, the healing film is included in the price of every tattoo. I ensure that the healing process is as comfortable and safe as possible for you."
        }
    },
    {
        question: {
            ru: "Где находится ваша студия?",
            en: "Where is your studio located?"
        },
        answer: {
            ru: "Я работаю в основном в Дублине, но также возможны выезды в другие города по предварительной договоренности. Для получения точной информации и записи, пожалуйста, свяжитесь со мной через раздел контакты или чат-бот.",
            en: "I primarily work in Dublin, but I can also travel to other cities by prior arrangement. For precise information and booking, please contact me via the contacts section or chat-bot."
        }
    },
    {
        question: {
            ru: "Нужна ли предоплата для записи на сеанс?",
            en: "Is a deposit required to book a session?"
        },
        answer: {
            ru: "Да, для подтверждения записи на сеанс требуется внесение предоплаты. Это гарантирует ваше место и позволяет мне подготовить эскиз и рабочее место специально для вас. Детали предоплаты обсуждаются индивидуально при записи.",
            en: "Yes, a deposit is required to confirm your session booking. This secures your spot and allows me to prepare the design and workstation specifically for you. Deposit details are discussed individually upon booking."
        }
    },
    {
        question: {
            ru: "Сколько времени занимает процесс заживления татуировки?",
            en: "How long does the tattoo healing process take?"
        },
        answer: {
            ru: "Обычно поверхностное заживление татуировки занимает от 1 до 2 недель при правильном уходе. Полное заживление кожи может занять до 1-2 месяцев. Я предоставлю подробные инструкции по уходу после сеанса.",
            en: "Typically, the superficial healing of a tattoo takes about 1 to 2 weeks with proper aftercare. Complete skin healing can take up to 1-2 months. I will provide detailed aftercare instructions after your session."
        }
    },
    {
        question: {
            ru: "Больно ли делать татуировку?",
            en: "Does getting a tattoo hurt?"
        },
        answer: {
            ru: "Ощущения от татуировки индивидуальны и зависят от болевого порога и места нанесения. Многие описывают это как терпимое жжение или вибрацию. Я стараюсь сделать процесс максимально комфортным для каждого клиента.",
            en: "The sensation of getting a tattoo is individual and depends on your pain tolerance and the placement. Many describe it as a tolerable burning or vibration. I strive to make the process as comfortable as possible for every client."
        }
    },
    {
        question: {
            ru: "Как подготовиться к тату-сеансу?",
            en: "How should I prepare for a tattoo session?"
        },
        answer: {
            ru: "Перед сеансом рекомендуется хорошо выспаться, плотно поесть, избегать алкоголя и кофеина, а также увлажнить кожу в месте будущей татуировки. Приходите отдохнувшими и в хорошем настроении!",
            en: "Before your session, it's recommended to get enough sleep, eat a good meal, avoid alcohol and caffeine, and moisturize the skin where the tattoo will be. Come rested and in good spirits!"
        }
    },
    {
        question: {
            ru: "Могу ли я исправить старую татуировку или шрам?",
            en: "Can I get an old tattoo or scar covered up?"
        },
        answer: {
            ru: "Да, я специализируюсь на услуге Cover Up — профессиональном перекрытии старых или неудачных татуировок, а также маскировке шрамов. Мы обсудим ваши пожелания и разработаем новый эскиз, который полностью преобразит проблемную зону.",
            en: "Yes, I specialize in Cover Up services – professionally covering old or unsuccessful tattoos, as well as camouflaging scars. We will discuss your wishes and create a new design that will completely transform the problematic area."
        }
    },
    {
        question: {
            ru: "Могу ли я прийти со своим эскизом?",
            en: "Can I come with my own design?"
        },
        answer: {
            ru: "Да, конечно! Вы можете принести свой эскиз или идею. Мы обсудим ее, и я помогу адаптировать или доработать ее, чтобы она идеально подходила для татуировки и выглядела наилучшим образом на вашей коже.",
            en: "Yes, absolutely! You can bring your own sketch or idea. We will discuss it, and I will help adapt or refine it so that it is perfectly suited for a tattoo and looks its best on your skin."
        }
    },
    {
        question: {
            ru: "Как ухаживать за татуировкой после снятия заживляющей пленки?",
            en: "How do I care for my tattoo after removing the healing film?"
        },
        answer: {
            ru: "После снятия пленки необходимо аккуратно промывать татуировку теплой водой с антибактериальным мылом без отдушек 2-3 раза в день, затем промакивать чистым полотенцем и наносить тонкий слой специального заживляющего крема. Избегайте прямого солнечного света, посещения саун, бассейнов и длительного замачивания.",
            en: "After removing the film, gently wash the tattoo 2-3 times in a day with warm water and unscented antibacterial soap, then pat dry with a clean towel and apply a thin layer of special healing cream. Avoid direct sunlight, saunas, swimming pools, and prolonged soaking."
        }
    },
    {
        question: {
            ru: "Можно ли заниматься спортом после татуировки?",
            en: "Can I exercise after getting a tattoo?"
        },
        answer: {
            ru: "В течение первых 1-2 недель после сеанса рекомендуется избегать интенсивных физических нагрузок, особенно тех, которые могут вызвать сильное потоотделение или трение в области татуировки. Легкие прогулки допустимы, но лучше дать телу время на восстановление.",
            en: "For the first 1-2 weeks after the session, it is recommended to avoid intense physical activity, especially those that may cause heavy sweating or friction in the tattooed area. Light walks are acceptable, but it's best to give your body time to recover."
        }
    }
];

const piercingFaqData = [
    {
        question: {
            ru: "Больно ли делать пирсинг?",
            en: "Does getting a piercing hurt?"
        },
        answer: {
            ru: "Ощущения зависят от места прокола и индивидуального болевого порога, но процедура обычно быстрая и большинство клиентов описывают ее как терпимое давление или короткий укол.",
            en: "The sensation depends on the piercing location and individual pain tolerance, but the procedure is usually quick, and most clients describe it as a tolerable pressure or a brief pinch."
        }
    },
    {
        question: {
            ru: "Сколько времени заживает пирсинг?",
            en: "How long does a piercing take to heal?"
        },
        answer: {
            ru: "Время заживления сильно зависит от места прокола. Некоторые пирсинги заживают за несколько недель (например, мочка уха), другие — до нескольких месяцев или даже года (например, хрящ). Я дам точные инструкции по уходу.",
            en: "Healing time varies greatly depending on the piercing location. Some piercings heal in a few weeks (e.g., earlobe), while others can take several months or even a year (e.g., cartilage). I will provide precise aftercare instructions."
        }
    },
    {
        question: {
            ru: "Как ухаживать за свежим пирсингом?",
            en: "How do I care for a new piercing?"
        },
        answer: {
            ru: "Уход включает регулярную очистку специальным раствором или солевым раствором, избегание прикосновений грязными руками и предотвращение травмирования места прокола. Подробные инструкции будут выданы после процедуры.",
            en: "Aftercare involves regular cleaning with a specialized solution or saline, avoiding touching with unwashed hands, and preventing trauma to the pierced area. Detailed instructions will be provided after the procedure."
        }
    },
    {
        question: {
            ru: "Можно ли сразу после пирсинга менять украшение?",
            en: "Can I change my piercing jewelry immediately?"
        },
        answer: {
            ru: "Нет, очень важно не менять первоначальное украшение до полного заживления пирсинга. Преждевременная замена может привести к инфекции, раздражению или смещению канала. Я сообщу, когда можно будет безопапасно сменить украшение.",
            en: "No, it is crucial not to change the initial jewelry until the piercing is fully healed. Pre-mature changing can leave an open wound leading to infection, irritation, or migration of the piercing channel. I will let you know when it's safe to change the jewelry."
        }
    },
    {
        question: {
            ru: "Какие материалы украшений используются для пирсинга?",
            en: "What jewelry materials are used for piercings?"
        },
        answer: {
            ru: "Для первичного пирсинга используются только гипоаллергенные и биосовместимые материалы, такие как титан имплантационного класса или хирургическая сталь 316L, чтобы минимизировать риск аллергических реакций и способствовать лучшему заживлению.",
            en: "For initial piercings, only hypoallergenic and biocompatible materials such as implant-grade titanium or 316L surgical steel are used to minimize the risk of allergic reactions and promote better healing."
        }
    }
];

const permanentMakeupFaqData = [
    {
        question: {
            ru: "Насколько болезненна процедура перманентного макияжа?",
            en: "How painful is the permanent makeup procedure?"
        },
        answer: {
            ru: "Ощущения во время процедуры индивидуальны, но большинство клиентов описывают их как вполне терпимые. Я стараюсь сделать процесс максимально комфортным, чтобы вы могли наслаждаться созданием своей красоты.",
            en: "Sensations during the procedure are individual, but most clients describe them as quite tolerable. I strive to make the process as comfortable as possible so you can enjoy creating your beauty."
        }
    },
    {
        question: {
            ru: "Сколько держится перманентный макияж?",
            en: "How long does permanent makeup last?"
        },
        answer: {
            ru: "Стойкость перманентного макияжа варьируется от 1 до 3 лет, в зависимости от типа кожи, выбранной техники, цвета пигмента и индивидуальных особенностей организма. Рекомендуется обновление раз в 1-1.5 года.",
            en: "The longevity of permanent makeup varies from 1 to 3 years, depending on skin type, chosen technique, pigment color, and individual body characteristics. A refresh is recommended every 1-1.5 years."
        }
    },
    {
        question: {
            ru: "Нужна ли коррекция после первой процедуры?",
            en: "Is a touch-up needed after the first permanent makeup procedure?"
        },
        answer: {
            ru: "Да, первичная коррекция обычно необходима через 4-6 недель после основной процедуры. Это позволяет скорректировать цвет и форму, закрепить результат и учесть, как пигмент усвоился кожей.",
            en: "Yes, an initial touch-up is usually necessary 4-6 weeks after the main procedure. This allows for color and shape correction, setting the result, and accounting for how the pigment was absorbed by the skin."
        }
    },
    {
        question: {
            ru: "Как выглядит зона после процедуры перманентного макияжа?",
            en: "What does the area look like after permanent makeup procedure?"
        },
        answer: {
            ru: "Сразу после процедуры цвет может казаться более ярким, а зона – немного покрасневшей или припухшей. Это нормальная реакция, которая проходит в течение нескольких дней. Окончательный цвет проявится после полного заживления.",
            en: "Immediately after the procedure, the color might appear more intense, and the area might be slightly red or swollen. This is a normal reaction that subsides within a few days. The final color will settle after complete healing."
        }
    },
    {
        question: {
            ru: "Есть ли противопоказания к перманентному макияжу?",
            en: "Are there any contraindications for permanent makeup?"
        },
        answer: {
            ru: "Да, как и у любой косметической процедуры, существуют некоторые противопоказания. Важно заранее обсудить ваше состояние здоровья со мной на консультации, чтобы убедиться, что процедура будет безопасной и принесет наилучший результат.",
            en: "Yes, as with any cosmetic procedure, there are some contraindications. It's important to discuss your health conditions with me during a consultation beforehand to ensure the procedure will be safe and provide the best results."
        }
    }
];


function createFaqItem(questionText, answerText, qIndex, aIndexPrefix) {
    const faqItem = document.createElement('div');
    faqItem.classList.add('faq-item');

    const questionDiv = document.createElement('div');
    questionDiv.classList.add('faq-question');
    questionDiv.innerHTML = `<span data-i18n-faq-q="${aIndexPrefix}${qIndex}">${questionText}</span> <span class="icon fas fa-chevron-down"></span>`;

    const answerDiv = document.createElement('div');
    answerDiv.classList.add('faq-answer');
    answerDiv.innerHTML = `<span data-i18n-faq-a="${aIndexPrefix}${qIndex}">${answerText}</span>`;

    questionDiv.addEventListener('click', () => {
        questionDiv.closest('.tab-pane').querySelectorAll('.faq-question.active').forEach(activeQ => {
            if (activeQ !== questionDiv) {
                activeQ.classList.remove('active');
                activeQ.querySelector('.icon').classList.remove('fa-chevron-up');
                activeQ.querySelector('.icon').classList.add('fa-chevron-down');
                activeQ.nextElementSibling.classList.remove('open');
            }
        });

        questionDiv.classList.toggle('active');
        const iconElement = questionDiv.querySelector('.icon');
        if (iconElement) {
            iconElement.classList.toggle('fa-chevron-down');
            iconElement.classList.toggle('fa-chevron-up');
        }
        answerDiv.classList.toggle('open');
    });

    faqItem.appendChild(questionDiv);
    faqItem.appendChild(answerDiv);
    return faqItem;
}

function renderFaq() {
    const faqGeneralContainer = document.getElementById('faqGeneral');
    const faqPiercingContainer = document.getElementById('faqPiercing');
    const faqPermanentContainer = document.getElementById('faqPermanent');

    if (!faqGeneralContainer || !faqPiercingContainer || !faqPermanentContainer) return;

    faqGeneralContainer.innerHTML = '';
    faqPiercingContainer.innerHTML = '';
    faqPermanentContainer.innerHTML = '';

    generalFaqData.forEach((item, index) => {
        const faqItem = createFaqItem(item.question[currentLang], item.answer[currentLang], index, 'general_');
        faqGeneralContainer.appendChild(faqItem);
    });

    piercingFaqData.forEach((item, index) => {
        const faqItem = createFaqItem(item.question[currentLang], item.answer[currentLang], index, 'piercing_');
        faqPiercingContainer.appendChild(faqItem);
    });

    permanentMakeupFaqData.forEach((item, index) => {
        const faqItem = createFaqItem(item.question[currentLang], item.answer[currentLang], index, 'permanent_');
        faqPermanentContainer.appendChild(faqItem);
    });

    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
}

function activateTab(tabName) {
    const targetTabButton = document.querySelector(`.tab-button[data-tab="${tabName}"]`);
    const targetTabPane = document.getElementById(`tab-${tabName}`);

    if (targetTabButton.classList.contains('active')) {
        targetTabButton.classList.remove('active');
        targetTabPane.classList.remove('active');
        targetTabPane.querySelectorAll('.faq-question.active').forEach(activeQ => {
            activeQ.classList.remove('active');
            activeQ.querySelector('.icon').classList.remove('fa-chevron-up');
            activeQ.querySelector('.icon').classList.add('fa-chevron-down');
            activeQ.nextElementSibling.classList.remove('open');
        });
        return;
    }

    document.querySelectorAll('.tab-button.active').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelectorAll('.tab-pane.active').forEach(pane => {
        pane.classList.remove('active');
        pane.querySelectorAll('.faq-question.active').forEach(activeQ => {
            activeQ.classList.remove('active');
            activeQ.querySelector('.icon').classList.remove('fa-chevron-up');
            activeQ.querySelector('.icon').classList.add('fa-chevron-down');
            activeQ.nextElementSibling.classList.remove('open');
        });
    });

    targetTabButton.classList.add('active');
    targetTabPane.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            activateTab(tabName);
        });
    });
});

const originalSetLanguage = setLanguage;
setLanguage = function(lang) {
    originalSetLanguage(lang);

    generalFaqData.forEach((item, index) => {
        const qSpan = document.querySelector(`[data-i18n-faq-q="general_${index}"]`);
        const aSpan = document.querySelector(`[data-i18n-faq-a="general_${index}"]`);
        if (qSpan) qSpan.textContent = item.question[lang];
        if (aSpan) aSpan.textContent = item.answer[lang];
    });

    piercingFaqData.forEach((item, index) => {
        const qSpan = document.querySelector(`[data-i18n-faq-q="piercing_${index}"]`);
        const aSpan = document.querySelector(`[data-i18n-faq-a="piercing_${index}"]`);
        if (qSpan) qSpan.textContent = item.question[lang];
        if (aSpan) aSpan.textContent = item.answer[lang];
    });

    permanentMakeupFaqData.forEach((item, index) => {
        const qSpan = document.querySelector(`[data-i18n-faq-q="permanent_${index}"]`);
        const aSpan = document.querySelector(`[data-i18n-faq-a="permanent_${index}"]`);
        if (qSpan) qSpan.textContent = item.question[lang];
        if (aSpan) aSpan.textContent = item.answer[lang];
    });

    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
        pane.querySelectorAll('.faq-question.active').forEach(activeQ => {
            activeQ.classList.remove('active');
            activeQ.querySelector('.icon').classList.remove('fa-chevron-up');
            activeQ.querySelector('.icon').classList.add('fa-chevron-down');
            activeQ.nextElementSibling.classList.remove('open');
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
    initReviewsCarousel();
    renderFaq();
});