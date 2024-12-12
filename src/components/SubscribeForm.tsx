// components/SubscribeForm.tsx
"use client";
import { useState } from 'react';
import { useTranslations } from 'next-intl';

const SubscribeForm = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const t = useTranslations("Sitemap");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);
    setError(null);
    setButtonDisabled(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
      });

      if (response.ok) {
        setStatus(t("successMessage") || "Successfully subscribed");
        setEmail("");
        setName("");
      } else {
        const errorData = await response.json();
        setError(errorData.error || t("genericError"));
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      setError(t("genericError"));
    } finally {
      setButtonDisabled(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="font-intl flex text-rodape flex-col gap-2 md:gap-4 mx-auto w-full">
      <h2 className="text-rodape">{t("title")}</h2>
      <div>
        <label htmlFor="name" className="block font-medium mb-1">{t("name")}</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-2 border border-black rounded-full py-1"
        />
      </div>
      <div>
        <label htmlFor="email" className="block font-medium mb-1">E-MAIL</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-2 border border-black rounded-full py-1"
        />
      </div>
      <button
        type="submit"
        className="w-fit py-1 px-6 rounded-full border border-black hover:bg-black hover:text-white gap-4 flex items-center"
        disabled={buttonDisabled}
      >
        <div>{t("subscribe")} <span className="pl-4 font-works">↑</span></div>
      </button>
      {status && <p className="text-green-500 mt-4 text-center">{status}</p>}
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </form>
  );
};

export default SubscribeForm;
