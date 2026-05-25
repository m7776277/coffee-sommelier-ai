import React, { useState, useEffect, useRef } from "react";
import { 
  Coffee, 
  Sparkles, 
  Sliders, 
  Gift, 
  Box, 
  Truck, 
  Send, 
  RefreshCw, 
  AlertCircle, 
  MessageSquare, 
  ChevronRight, 
  Check, 
  ShoppingBag, 
  Info,
  Calendar,
  X,
  Plus
} from "lucide-react";
import { Message, RecommendationCard, CategoryItem, KBRecord } from "./types";

const CATEGORIES: CategoryItem[] = [
  {
    id: "coffee",
    name: "Подбор кофе",
    iconName: "coffee",
    description: "Помощь в выборе идеального сорта арабики по вашему вкусу",
    starterQuestion: "Помогите мне подобрать сорт кофе по моим вкусовым предпочтениям"
  },
  {
    id: "grind",
    name: "Помол",
    iconName: "sliders",
    description: "Рекомендации размера помола под любой способ заваривания",
    starterQuestion: "Какой помол выбрать и как он влияет на вкус заваренного кофе?"
  },
  {
    id: "subscription",
    name: "Подписка",
    iconName: "gift",
    description: "Регулярная доставка свежеобжаренного кофе лично для вас",
    starterQuestion: "Расскажите подробнее про вашу кофейную подписку и тарифные планы"
  },
  {
    id: "storage",
    name: "Хранение",
    iconName: "box",
    description: "Простые правила сохранения вкуса и аромата зерен дома",
    starterQuestion: "Как правильно хранить свежеобжаренный кофе дома, чтобы он не выдохся?"
  },
  {
    id: "shipping",
    name: "Доставка и оплата",
    iconName: "truck",
    description: "Условия бесплатной доставки, способы оплаты и правила возврата",
    starterQuestion: "Какие у вас условия доставки, способы оплаты заказа и правила возврата?"
  }
];

// Aesthetic defaults for recommendation cards
const DEFAULT_CARDS: Record<string, RecommendationCard> = {
  coffee: {
    title: "Бразилия Серрадо",
    description: "Популярный представитель южноамериканской классики. Насыщенное тело с плотной текстурой и минимальной кислотностью.",
    parameters: [
      { label: "Обжарка", value: "Средняя (под эспрессо)" },
      { label: "Кислинка", value: "1 из 5" },
      { label: "Профиль вкуса", value: "Темный шоколад, карамель, фундук" },
      { label: "Цена за 250г", value: "490 ₽" }
    ],
    actionText: "Заказать сорт"
  },
  grind: {
    title: "Средний помол (под фильтр)",
    description: "Универсальный фракционный размер помола, напоминающий речной песок. Идеально сбалансированное время экстракции.",
    parameters: [
      { label: "Метод заваривания", value: "Капельная кофеварка, Воронка V60" },
      { label: "Размер частиц", value: "Около 0.75 мм" },
      { label: "Особенность", value: "Раскрывает чистый вкус без кофейной пыли" },
      { label: "Совет", value: "Молоть перед завариванием" }
    ],
    actionText: "Выбрать этот помол"
  },
  subscription: {
    title: "Тариф «Гурман»",
    description: "Регулярное гастрономическое путешествие. Каждую отправку мы подбираем для вас новый эксклюзивный сорт крафтовой арабики.",
    parameters: [
      { label: "Частота", value: "Каждые 2 или 4 недели" },
      { label: "Доставка", value: "Всегда бесплатно" },
      { label: "Бонус", value: "Скидка 15% на аксессуары" },
      { label: "Стоимость", value: "1 990 ₽ / месяц" }
    ],
    actionText: "Оформить подписку"
  },
  storage: {
    title: "Вакуумный контейнер сомелье",
    description: "Лучшее решение для домашнего сбережения свежеобжаренного зерна от главного врага вкуса — кислорода и солнечного света.",
    parameters: [
      { label: "Материал", value: "Непищевая сталь с клапаном CO2" },
      { label: "Емкость", value: "До 500 грамм свежего зерна" },
      { label: "Срок хранения", value: "Увеличивает свежесть в 2-3 раза" },
      { label: "Цена комплекта", value: "1 450 ₽" }
    ],
    actionText: "Заказать контейнер"
  },
  shipping: {
    title: "Быстрая курьерская доставка",
    description: "Бережная доставка Вашего свежеобжаренного кофе в любую точку Российской Федерации с сохранением пика аромата.",
    parameters: [
      { label: "Сроки сборки", value: "Мгновенно в день свежей обжарки" },
      { label: "Бесплатная доставка", value: "При покупке от 2 000 ₽" },
      { label: "Способы оплаты", value: "СПБ, СберПэй, Банковские Карты" },
      { label: "География доставки", value: "По всей России (СДЭК, Почта)" }
    ],
    actionText: "Рассчитать доставку"
  },
  none: {
    title: "Подарочный набор сомелье",
    description: "Набор-дегустация из четырех знаковых моносортов свежей обжарки по 100 грамм для расширения вкусового кругозора.",
    parameters: [
      { label: "Состав комплекта", value: "4 сорта Африки и Лат. Америки" },
      { label: "Подарочный бокс", value: "В комплекте" },
      { label: "Для кого подходит", value: "Идеален для крутого подарка" },
      { label: "Цена набора", value: "1 790 ₽" }
    ],
    actionText: "Заказать бокс"
  }
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Здравствуйте! Я — Ваш личный AI-ассистент «Кофейный сомелье». С удовольствием помогу Вам подобрать свежеобжаренный кофе под Ваш способ заваривания, расскажу о размерах помола, организую регулярную подписку или отвечу на вопросы о доставке и оплате.\n\nКакая тема Вас интересует? Нажмите на любую категорию слева, или просто напишите свой вопрос!",
      timestamp: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      recommendationType: "coffee",
      recommendationCard: DEFAULT_CARDS.coffee
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"categories" | "chat" | "recommendation">("chat");
  const [activeRightCard, setActiveRightCard] = useState<RecommendationCard>(DEFAULT_CARDS.coffee);
  const [activeRightType, setActiveRightType] = useState<string>("coffee");
  const [newRecommendationHighlight, setNewRecommendationHighlight] = useState(false);
  
  // KB metadata
  const [kbEntries, setKbEntries] = useState<KBRecord[]>([]);
  const [isKBLoadingFromSheet, setIsKBLoadingFromSheet] = useState(false);
  const [loadedFromGoogleSheets, setLoadedFromGoogleSheets] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>("Загрузка базы знаний...");

  // Modal / notification state for action button click
  const [notification, setNotification] = useState<{ show: boolean; text: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll chat to bottom when message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  // Fetch KB statistics on startup
  useEffect(() => {
    fetchKBStats();
  }, []);

  const fetchKBStats = async () => {
    try {
      const res = await fetch("/api/kb");
      if (res.ok) {
        const data = await res.json();
        setKbEntries(data.entries || []);
        setLoadedFromGoogleSheets(data.loadedFromGoogleSheets);
        if (data.loadedFromGoogleSheets) {
          setSyncStatus(`База знаний успешно загружена из Google Sheets (${data.count} записей)`);
        } else {
          setSyncStatus(`База запущена в режиме локального кэша (${data.count} записей)`);
        }
      } else {
        setSyncStatus("Используются локальные кофейные правила");
      }
    } catch (e) {
      setSyncStatus("Используются локальные кофейные правила");
    }
  };

  const handlesSyncRefresh = async () => {
    setIsKBLoadingFromSheet(true);
    setSyncStatus("Синхронизация с Google Sheets...");
    try {
      const res = await fetch("/api/kb/refresh", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setLoadedFromGoogleSheets(data.loadedFromGoogleSheets);
        if (data.loadedFromGoogleSheets) {
          showNotification(`База знаний успешно синхронизирована! Загружено строк: ${data.count}`);
          setSyncStatus(`Данные обновлены из Google Sheets (${data.count} строк)`);
        } else {
          showNotification(`Используется локальный кэш.`);
          setSyncStatus(`Локальный кэш данных готов (${data.count} строк)`);
        }
        // reload entries
        const updatedKB = await fetch("/api/kb");
        if (updatedKB.ok) {
          const ud = await updatedKB.json();
          setKbEntries(ud.entries || []);
        }
      } else {
        showNotification("Ошибка при запросе обновления");
        setSyncStatus("Сбой синхронизации");
      }
    } catch (e) {
      showNotification("Ошибка подключения к серверу");
      setSyncStatus("Сбой подключения");
    } finally {
      setIsKBLoadingFromSheet(false);
    }
  };

  const showNotification = (text: string) => {
    setNotification({ show: true, text });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Pre-fill starter question from left category click
  const handleCategoryClick = (category: CategoryItem) => {
    setInputText(category.starterQuestion);
    // Switch view to chat on mobile
    setActiveTab("chat");
    // Ensure input gets focused
    setTimeout(() => {
      chatInputRef.current?.focus();
    }, 100);
  };

  // Submit request to Express API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText || inputText.trim() === "" || isGenerating) return;

    const userMessageText = inputText.trim();
    setInputText("");

    const userMessage: Message = {
      id: "msg-" + Date.now(),
      sender: "user",
      text: userMessageText,
      timestamp: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsGenerating(true);

    try {
      // Send chat history to back-end to support multi-turn conversational memory
      const chatHistoryForAPI = messages.map(msg => ({
        sender: msg.sender,
        text: msg.text
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userMessageText,
          history: chatHistoryForAPI
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned code ${response.status}`);
      }

      const responseData = await response.json();

      const botMessage: Message = {
        id: "msg-ai-" + Date.now(),
        sender: "bot",
        text: responseData.reply || "Извините, не удалось сформировать ответ.",
        timestamp: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
        recommendationType: responseData.recommendationType || "none",
        recommendationCard: responseData.recommendationCard
      };

      setMessages(prev => [...prev, botMessage]);

      // Update right-side recommendation card if recommendation has physical data
      if (responseData.recommendationType && responseData.recommendationType !== "none" && responseData.recommendationCard) {
        setActiveRightCard(responseData.recommendationCard);
        setActiveRightType(responseData.recommendationType);
        setNewRecommendationHighlight(true);
        setTimeout(() => setNewRecommendationHighlight(false), 2000);
      } else if (responseData.recommendationType === "none" && responseData.recommendationCard) {
        // AI proposed a custom general card
        setActiveRightCard(responseData.recommendationCard);
        setActiveRightType("none");
      }

    } catch (error: any) {
      console.error(error);
      const errorMessage: Message = {
        id: "msg-err-" + Date.now(),
        sender: "bot",
        text: "Произошла неполадка сети или сервера. Проверьте подключение или настройки ключа GEMINI_API_KEY. Я сгенерировал автоответ на основе локальных кодов.",
        timestamp: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper to parse line-broken responses with neat list styling
  const formatResponseText = (text: string) => {
    if (!text) return null;
    const blocks = text.split("\n\n");
    return blocks.map((block, bIdx) => {
      const lines = block.split("\n");
      const isList = lines.some(l => l.trim().startsWith("-") || l.trim().startsWith("*") || /^\d+\./.test(l.trim()));
      
      if (isList) {
        return (
          <div key={bIdx} className="my-3 pl-1">
            <ul className="space-y-2">
              {lines.map((line, lIdx) => {
                const cleanLine = line.trim()
                  .replace(/^[-*]\s*/, "")
                  .replace(/^\d+[\.\)]\s*/, "");
                
                // Keep leading numbers for structured display lists
                const matchNumber = line.trim().match(/^(\d+)[\.\)]/);
                const listNum = matchNumber ? matchNumber[1] + ". " : "";

                return (
                  <li key={lIdx} className="flex items-start text-sm md:text-[15px] text-stone-800 leading-relaxed">
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-700 mt-2 mr-3 shrink-0"></span>
                    <span>
                      {listNum && <strong className="text-amber-900">{listNum}</strong>}
                      {formatInlineBold(cleanLine)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      }

      return (
        <p key={bIdx} className="text-sm md:text-[15px] text-stone-800 leading-relaxed mb-3 last:mb-0">
          {block.split("\n").map((line, lIdx) => (
            <span key={lIdx} className="block mb-1">
              {formatInlineBold(line)}
            </span>
          ))}
        </p>
      );
    });
  };

  // Formats text wrapped in **bold** markup into JSX element
  const formatInlineBold = (text: string) => {
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="font-semibold text-stone-950 bg-amber-100/40 px-0.5 rounded">{part}</strong>;
      }
      return part;
    });
  };

  // Map icon names to lucide components cased carefully inside Clean Minimalism colors
  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "coffee":
        return <Coffee className="w-4 h-4 text-coffee-700" />;
      case "sliders":
        return <Sliders className="w-4 h-4 text-coffee-700" />;
      case "gift":
        return <Gift className="w-4 h-4 text-coffee-700" />;
      case "box":
        return <Box className="w-4 h-4 text-coffee-700" />;
      case "truck":
        return <Truck className="w-4 h-4 text-coffee-700" />;
      default:
        return <Coffee className="w-4 h-4 text-coffee-700" />;
    }
  };

  // Keyboard shortcut to submit with Enter (without Shift)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen bg-coffee-50 text-coffee-950 flex flex-col font-sans transition-colors duration-200">
      
      {/* Dynamic Toast Notification Drawer */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-coffee-900 text-coffee-50 py-3.5 px-5 rounded-2xl shadow-lg border border-coffee-950 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-sm font-medium">{notification.text}</span>
          <button onClick={() => setNotification(null)} className="ml-2 hover:text-coffee-300 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Header / Title Bar */}
      <header className="bg-white border-b border-coffee-200 sticky top-0 z-30 shadow-xs backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo Brand Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-coffee-700 flex items-center justify-center text-white shadow-xs">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl font-bold tracking-tight text-coffee-950">
                  Сомелье AI
                </h1>
                <span className="bg-coffee-100 text-coffee-700 text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded border border-coffee-200">
                  Ассистент
                </span>
              </div>
              <p className="text-xs text-coffee-500 tracking-wide">
                Эксперт онлайн-магазина по зерну и завариванию
              </p>
            </div>
          </div>

          {/* Right Header Controls / DB Sync status */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end text-xs">
            <div className="bg-coffee-100 border border-coffee-200 text-coffee-700 py-1.5 px-3 rounded-full flex items-center gap-2 max-w-xs truncate">
              <span className={`w-2 h-2 rounded-full shrink-0 ${loadedFromGoogleSheets ? "bg-green-500" : "bg-amber-500"}`}></span>
              <span className="truncate font-medium capitalize" title={syncStatus}>
                {syncStatus}
              </span>
            </div>

            <button
              onClick={handlesSyncRefresh}
              disabled={isKBLoadingFromSheet}
              className="bg-white hover:bg-coffee-100 text-coffee-700 p-2 rounded-xl border border-coffee-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              title="Синхронизировать базу знаний с Google Sheets"
              id="btn-sync-kb"
            >
              <RefreshCw className={`w-4 h-4 text-coffee-500 group-hover:text-coffee-900 ${isKBLoadingFromSheet ? "animate-spin" : ""}`} />
            </button>
          </div>

        </div>
      </header>

      {/* Primary Container Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        
        {/* Mobile View Navigation Tab Bar */}
        <div className="lg:hidden flex bg-coffee-100 p-1 rounded-2xl border border-coffee-200 gap-1">
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "categories"
                ? "bg-white text-coffee-950 shadow-xs border border-coffee-200"
                : "text-coffee-500 hover:text-coffee-950"
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            Разделы
          </button>
          
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "chat"
                ? "bg-white text-coffee-950 shadow-xs border border-coffee-200"
                : "text-coffee-500 hover:text-coffee-950"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Диалог
          </button>
          
          <button
            onClick={() => setActiveTab("recommendation")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all relative ${
              activeTab === "recommendation"
                ? "bg-white text-coffee-950 shadow-xs border border-coffee-200"
                : "text-coffee-500 hover:text-coffee-950"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Рекомендация
            {activeRightType !== 'none' && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-coffee-700"></span>
            )}
          </button>
        </div>

        {/* Responsive Desktop bento panels grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-stretch h-[600px] lg:h-[700px] min-h-[520px]">
          
          {/* ZONE 1: Left category list sidebar */}
          <section 
            className={`lg:col-span-3 flex flex-col gap-4 ${
              activeTab === "categories" ? "block" : "hidden lg:flex"
            }`}
          >
            <div className="bg-coffee-100/40 border border-coffee-200 rounded-3xl p-5 shadow-xs flex flex-col gap-5 h-full">
              <div className="border-b border-coffee-200 pb-3">
                <h2 className="font-serif text-lg font-bold text-coffee-950">
                  Подберите тему
                </h2>
                <p className="text-xs text-coffee-500 mt-1.5">
                  При клике на тему соответствующий вопрос сомелье подставится в диалоговое окно автоматически.
                </p>
              </div>

              <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto pr-1">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-transparent hover:border-coffee-200 bg-white shadow-xs hover:shadow-md hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer group text-left"
                    id={`category-btn-${category.id}`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-coffee-100 flex items-center justify-center shrink-0 group-hover:bg-coffee-200 transition-colors">
                      {renderCategoryIcon(category.iconName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-sm text-coffee-950 block truncate group-hover:text-coffee-700 transition-colors">
                        {category.name}
                      </span>
                      <span className="text-[10px] text-coffee-500 block truncate leading-normal mt-0.5">
                        {category.description}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Status note styled like template status badge */}
              <div className="mt-auto p-4 bg-coffee-100 rounded-2xl border border-coffee-200">
                <p className="text-[10px] text-coffee-500 uppercase font-bold tracking-wider mb-1">Режим обжарочной</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-semibold text-coffee-950">Крафтовая обжарка сегодня</span>
                </div>
              </div>

            </div>
          </section>

          {/* ZONE 2: Central Chat Panel */}
          <section 
            className={`lg:col-span-6 flex flex-col gap-4 h-full min-h-[480px] ${
              activeTab === "chat" ? "block" : "hidden lg:flex"
            }`}
          >
            <div className="bg-white border border-coffee-200 rounded-3xl shadow-sm flex flex-col h-full overflow-hidden">
              
              {/* Active Conversation Indicator Header */}
              <div className="bg-coffee-100/30 border-b border-coffee-200 py-3.5 px-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs font-semibold text-coffee-700 tracking-wide uppercase">
                    Интерактивная сессия «Обжарка»
                  </span>
                </div>
                
                {messages.length > 1 && (
                  <button
                    onClick={() => {
                      if (confirm("Вы действительно хотите очистить историю диалога в этой сессии?")) {
                        setMessages([
                          {
                            id: "welcome-reset",
                            sender: "bot",
                            text: "Приветствую Вас снова! История очищена. Какая кофейная тема Вас интересует в данный момент? Спросите меня о подборе зерен, помоле или как работает регулярная подписка на кофе.",
                            timestamp: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
                            recommendationType: "coffee",
                            recommendationCard: DEFAULT_CARDS.coffee
                          }
                        ]);
                        setActiveRightCard(DEFAULT_CARDS.coffee);
                        setActiveRightType("coffee");
                      }
                    }}
                    className="text-coffee-500 hover:text-coffee-900 bg-coffee-100 hover:bg-coffee-200 py-1 px-3 rounded-lg text-xs transition-colors"
                    id="btn-clear-chat-history"
                  >
                    Очистить историю
                  </button>
                )}
              </div>

              {/* Chat messages viewport */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {messages.map((message) => {
                  const isUser = message.sender === "user";
                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3.5 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                    >
                      {/* Avatar matching clean design mockup colors */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs text-xs font-bold leading-none ${
                        isUser 
                          ? "bg-coffee-400 text-white" 
                          : "bg-coffee-700 text-white"
                      }`}>
                        {isUser ? "ВЫ" : "AI"}
                      </div>

                      {/* Msg bubble container */}
                      <div className="flex flex-col">
                        <div className={`p-4 rounded-2xl shadow-xs border text-coffee-950 font-normal ${
                          isUser 
                            ? "bg-coffee-200/90 border-coffee-300 rounded-tr-none text-[#3E2723]" 
                            : "bg-white border-coffee-200 rounded-tl-none"
                        }`}>
                          <div className="text-sm md:text-[14.5px] leading-relaxed select-text whitespace-pre-line">
                            {isUser ? formatInlineBold(message.text) : formatResponseText(message.text)}
                          </div>
                        </div>
                        <span className={`text-[10px] text-coffee-400 mt-1 px-1.5 ${isUser ? "text-right" : "text-left"}`}>
                          {message.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Loading brewing placeholder when model generates response */}
                {isGenerating && (
                  <div className="flex gap-3.5 max-w-[85%] mr-auto">
                    <div className="w-8 h-8 rounded-full bg-coffee-700 text-white flex items-center justify-center shrink-0">
                      <Coffee className="w-4 h-4 animate-spin text-white" />
                    </div>
                    <div>
                      <div className="bg-coffee-50 border border-coffee-200 p-4 rounded-2xl rounded-tl-none flex flex-col gap-2">
                        <div className="flex items-center gap-1.5 mb-1">
                          <div className="w-1.5 h-1.5 bg-coffee-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                          <div className="w-1.5 h-1.5 bg-coffee-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                          <div className="w-1.5 h-1.5 bg-coffee-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                        </div>
                        <p className="text-xs text-coffee-500 italic">Анализирую базу свежего урожая...</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Base typing Area - Input style perfectly matched */}
              <div className="p-5 bg-white border-t border-coffee-200">
                <form onSubmit={handleSubmit} className="flex gap-3 items-center relative">
                  <div className="flex-1 relative flex items-center bg-coffee-100 rounded-2xl border-none focus-within:ring-2 focus-within:ring-coffee-700 transition-all">
                    <textarea
                      ref={chatInputRef}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Напишите ваш вопрос здесь..."
                      className="w-full pl-5 pr-14 py-3 bg-transparent text-coffee-950 outline-hidden placeholder-coffee-400 resize-none max-h-24 text-sm scrollbar-thin"
                      rows={1}
                      disabled={isGenerating}
                      id="chat-textarea-input"
                    />
                    
                    <button
                      type="submit"
                      disabled={!inputText.trim() || isGenerating}
                      className="absolute right-2 p-2.5 bg-coffee-700 hover:bg-coffee-800 disabled:opacity-35 text-white flex items-center justify-center rounded-xl transition-all shadow-xs shrink-0 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed cursor-pointer"
                      id="btn-chat-send"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
                <div className="text-[10px] text-coffee-400 mt-2 px-1 flex justify-between font-medium">
                  <span>Клавиша Enter — отправка, Shift+Enter — новая строка</span>
                  <span>База знаний оберегает Ваши секреты</span>
                </div>
              </div>

            </div>
          </section>

          {/* ZONE 3: Right recommendations card display preview - Matches rounded-3xl design perfectly */}
          <section 
            className={`lg:col-span-3 flex flex-col gap-4 ${
              activeTab === "recommendation" ? "block" : "hidden lg:flex"
            }`}
          >
            <div className={`bg-coffee-50 border text-coffee-950 rounded-3xl shadow-lg flex flex-col h-full justify-between overflow-hidden transition-all duration-300 ${
              newRecommendationHighlight ? "border-coffee-700 scale-[1.01] ring-3 ring-coffee-300" : "border-coffee-200"
            }`}>
              
              {/* Header card state */}
              <div>
                {/* Header graphic or illustrations */}
                <div className="h-40 bg-[#EFE9E1] relative flex items-center justify-center overflow-hidden border-b border-coffee-200 group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
                  
                  {/* Absolute visual coffee rings decorations */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border-2 border-coffee-700/5 group-hover:scale-110 transition-transform duration-500"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-coffee-700/5 group-hover:scale-105 transition-transform duration-500"></div>

                  <div className="bg-white p-3.5 rounded-2xl shadow-sm text-coffee-700 group-hover:rotate-6 transition-transform z-10">
                    {activeRightType === "coffee" && <Coffee className="w-8 h-8" />}
                    {activeRightType === "grind" && <Sliders className="w-8 h-8" />}
                    {activeRightType === "subscription" && <Gift className="w-8 h-8" />}
                    {activeRightType === "storage" && <Box className="w-8 h-8" />}
                    {activeRightType === "shipping" && <Truck className="w-8 h-8" />}
                    {activeRightType === "none" && <Box className="w-8 h-8" />}
                  </div>

                  <div className="absolute bottom-3 left-3 bg-[#A67C52] text-white text-[10px] px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                    {activeRightType === "coffee" && "Светлая обжарка"}
                    {activeRightType === "grind" && "Идеальная экстракция"}
                    {activeRightType === "subscription" && "Прямо со склада"}
                    {activeRightType === "storage" && "Сбережение вкуса"}
                    {activeRightType === "shipping" && "Быстрая доставка"}
                    {activeRightType === "none" && "Специальный выбор"}
                  </div>
                </div>

                <div className="p-5 flex flex-col">
                  {/* Small recommendation badge label */}
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <div className="w-1.5 h-1.5 bg-coffee-300 rounded-full"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8D6E63]">
                      Рекомендация
                    </span>
                  </div>

                  {/* Card Title Description */}
                  <h3 className="font-serif text-xl font-bold text-coffee-950 tracking-tight mb-2">
                    {activeRightCard.title}
                  </h3>
                  
                  <p className="text-xs text-coffee-600 leading-relaxed mb-5">
                    {activeRightCard.description}
                  </p>

                  {/* 2x2 Clean Parameters Grid layout from Clean Minimalism spec */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 mb-6 pt-1 border-t border-coffee-200/60 pt-4">
                    {activeRightCard.parameters && activeRightCard.parameters.map((param, index) => (
                      <div key={index} className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-[9.5px] uppercase font-bold tracking-wider text-coffee-400 truncate">{param.label}</span>
                        <span className="text-xs font-semibold text-coffee-950 break-words line-clamp-2" title={param.value}>
                          {param.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Card Action trigger */}
              <div className="m-5 mt-0 pt-4 border-t border-coffee-200">
                <button
                  onClick={() => {
                    const trackingTitle = activeRightCard.title;
                    showNotification(`Вы выбрали: "${trackingTitle}"! Сорт добавлен в корзину (симуляция оформления)`);
                  }}
                  className="w-full bg-coffee-700 hover:bg-coffee-800 text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-xs hover:shadow-md hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  id="btn-right-recommendation-cta"
                >
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  {activeRightCard.actionText}
                </button>
                
                {/* Visual stats footer */}
                <div className="mt-4 flex items-center justify-center gap-2.5 opacity-55">
                  <div className="flex -space-x-2">
                    <div className="w-5 h-5 rounded-full bg-coffee-300 border border-white"></div>
                    <div className="w-5 h-5 rounded-full bg-coffee-400 border border-white"></div>
                    <div className="w-5 h-5 rounded-full bg-coffee-200 border border-white"></div>
                  </div>
                  <p className="text-[9.5px] font-semibold text-coffee-500">42 сомелье выбрали за этот час</p>
                </div>
              </div>

            </div>
          </section>

        </div>
      </main>

      {/* Footer copyright with clean minimal colors */}
      <footer className="bg-white border-t border-coffee-200 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-coffee-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-coffee-700">© 2026 Кофейный сомелье.</span>
            <span>Свежеобжаренный кофе с доставкой по РФ.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-coffee-400">Версия: 3.5.flash-latest</span>
            <span className="text-coffee-400">Лицензия: Apache-2.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
