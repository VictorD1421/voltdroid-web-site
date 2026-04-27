import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export default async function Home() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white dark:bg-black transition-colors duration-300">
      <Navbar user={user} />
      <main className="flex-grow">
        <Hero />
        <About />
        <Services />
        <WhyUs />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}