"use client";

/*
  Componente de planos (pricing) integrado do prompt original.
  Ajustes feitos para este projeto:
  - textos em português e preços em reais (BRL, pt-BR);
  - tipos de ref compatíveis com React 19 (RefObject<HTMLDivElement | null>);
  - estrelas geradas só depois de montar, para não dar erro de hidratação no SSR;
  - cores do confete em hex (canvas-confetti não entende hsl(var(--x)));
  - fundo transparente para usar o céu estrelado da página;
  - campo opcional `note` em cada plano (ex.: taxa de implantação).
*/

import { motion, useSpring } from "framer-motion";
import React, {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
  useSyncExternalStore,
} from "react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { Check, Star as LucideStar } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- UTILITY FUNCTIONS ---

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useMediaQuery(query: string) {
  // useSyncExternalStore evita setState dentro de effect (regra do React 19)
  return useSyncExternalStore(
    (onChange) => {
      const result = matchMedia(query);
      result.addEventListener("change", onChange);
      return () => result.removeEventListener("change", onChange);
    },
    () => matchMedia(query).matches,
    () => false,
  );
}

// --- BASE UI COMPONENTS (BUTTON) ---

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

// --- INTERACTIVE STARFIELD ---

type StarSeed = {
  top: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
};

function makeStar(): StarSeed {
  return {
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: 1 + Math.random() * 2,
    duration: 2 + Math.random() * 3,
    delay: Math.random() * 5,
  };
}

function Star({
  seed,
  mousePosition,
  containerRef,
}: {
  seed: StarSeed;
  mousePosition: { x: number | null; y: number | null };
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const springConfig = { stiffness: 100, damping: 15, mass: 0.1 };
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);

  useEffect(() => {
    if (
      !containerRef.current ||
      mousePosition.x === null ||
      mousePosition.y === null
    ) {
      springX.set(0);
      springY.set(0);
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const starX =
      containerRect.left + (parseFloat(seed.left) / 100) * containerRect.width;
    const starY =
      containerRect.top + (parseFloat(seed.top) / 100) * containerRect.height;

    const deltaX = mousePosition.x - starX;
    const deltaY = mousePosition.y - starY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    const radius = 600; // Radius of magnetic influence

    if (distance < radius) {
      const force = 1 - distance / radius;
      springX.set(deltaX * force * 0.5);
      springY.set(deltaY * force * 0.5);
    } else {
      springX.set(0);
      springY.set(0);
    }
  }, [mousePosition, seed, containerRef, springX, springY]);

  return (
    <motion.div
      className="absolute bg-foreground rounded-full"
      style={{
        top: seed.top,
        left: seed.left,
        width: `${seed.size}px`,
        height: `${seed.size}px`,
        x: springX,
        y: springY,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{
        duration: seed.duration,
        repeat: Infinity,
        delay: seed.delay,
      }}
    />
  );
}

function InteractiveStarfield({
  mousePosition,
  containerRef,
}: {
  mousePosition: { x: number | null; y: number | null };
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  // Gera as estrelas só no cliente: Math.random() no SSR causaria
  // diferença de hidratação entre servidor e navegador.
  const [stars, setStars] = useState<StarSeed[]>([]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStars(Array.from({ length: 150 }, makeStar));
  }, []);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
    >
      {stars.map((seed, i) => (
        <Star
          key={`star-${i}`}
          seed={seed}
          mousePosition={mousePosition}
          containerRef={containerRef}
        />
      ))}
    </div>
  );
}

// --- PRICING COMPONENT LOGIC ---

// Interfaces
export interface PricingPlan {
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular?: boolean;
  note?: string;
}

interface PricingSectionProps {
  plans: PricingPlan[];
  title?: React.ReactNode;
  description?: string;
  id?: string;
}

// Context for state management
const PricingContext = createContext<{
  isMonthly: boolean;
  setIsMonthly: (value: boolean) => void;
}>({
  isMonthly: true,
  setIsMonthly: () => {},
});

// Main PricingSection Component
export function PricingSection({
  plans,
  title = "Planos simples, sem letra miúda",
  description = "Escolha o plano que combina com o seu momento. Todos incluem suporte e manutenção.",
  id,
}: PricingSectionProps) {
  const [isMonthly, setIsMonthly] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState<{
    x: number | null;
    y: number | null;
  }>({ x: null, y: null });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = event;
    setMousePosition({ x: clientX, y: clientY });
  };

  return (
    <PricingContext.Provider value={{ isMonthly, setIsMonthly }}>
      <div
        id={id}
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMousePosition({ x: null, y: null })}
        className="relative w-full bg-transparent py-20 sm:py-24"
      >
        <InteractiveStarfield
          mousePosition={mousePosition}
          containerRef={containerRef}
        />
        <div className="relative z-10 container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl text-neutral-900 dark:text-white">
              {title}
            </h2>
            <p className="text-muted-foreground text-lg whitespace-pre-line">
              {description}
            </p>
          </div>
          <PricingToggle />
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 items-start gap-8">
            {plans.map((plan, index) => (
              <PricingCard key={index} plan={plan} index={index} />
            ))}
          </div>
        </div>
      </div>
    </PricingContext.Provider>
  );
}

// Pricing Toggle Component
function PricingToggle() {
  const { isMonthly, setIsMonthly } = useContext(PricingContext);
  const confettiRef = useRef<HTMLDivElement>(null);
  const monthlyBtnRef = useRef<HTMLButtonElement>(null);
  const annualBtnRef = useRef<HTMLButtonElement>(null);

  const [pillStyle, setPillStyle] = useState({});

  useEffect(() => {
    const btnRef = isMonthly ? monthlyBtnRef : annualBtnRef;
    if (btnRef.current) {
      setPillStyle({
        width: btnRef.current.offsetWidth,
        transform: `translateX(${btnRef.current.offsetLeft}px)`,
      });
    }
  }, [isMonthly]);

  const handleToggle = (monthly: boolean) => {
    if (isMonthly === monthly) return;
    setIsMonthly(monthly);

    if (!monthly && confettiRef.current) {
      const rect = annualBtnRef.current?.getBoundingClientRect();
      if (!rect) return;

      const originX = (rect.left + rect.width / 2) / window.innerWidth;
      const originY = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 80,
        spread: 80,
        origin: { x: originX, y: originY },
        colors: ["#4fd8e6", "#5b8cff", "#ff8a3d", "#3ddc84", "#e6c89a"],
        ticks: 300,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        disableForReducedMotion: true,
      });
    }
  };

  return (
    <div className="flex justify-center">
      <div
        ref={confettiRef}
        className="relative flex w-fit items-center rounded-full bg-muted p-1"
      >
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full bg-primary p-1"
          style={pillStyle}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        />
        <button
          ref={monthlyBtnRef}
          onClick={() => handleToggle(true)}
          aria-pressed={isMonthly}
          className={cn(
            "relative z-10 rounded-full px-4 sm:px-6 py-2 text-sm font-medium transition-colors",
            isMonthly
              ? "text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Mensal
        </button>
        <button
          ref={annualBtnRef}
          onClick={() => handleToggle(false)}
          aria-pressed={!isMonthly}
          className={cn(
            "relative z-10 rounded-full px-4 sm:px-6 py-2 text-sm font-medium transition-colors",
            !isMonthly
              ? "text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Anual
          <span
            className={cn(
              "hidden sm:inline",
              !isMonthly ? "text-primary-foreground/80" : "",
            )}
          >
            {" "}
            (economize 20%)
          </span>
        </button>
      </div>
    </div>
  );
}

// Pricing Card Component
function PricingCard({ plan, index }: { plan: PricingPlan; index: number }) {
  const { isMonthly } = useContext(PricingContext);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      whileInView={{
        y: plan.isPopular && isDesktop ? -20 : 0,
        opacity: 1,
      }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: index * 0.15,
      }}
      className={cn(
        "rounded-2xl p-8 flex flex-col relative bg-background/70 backdrop-blur-sm",
        plan.isPopular
          ? "border-2 border-primary shadow-xl"
          : "border border-border",
      )}
    >
      {plan.isPopular && (
        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
          <div className="bg-primary py-1.5 px-4 rounded-full flex items-center gap-1.5">
            <LucideStar className="text-primary-foreground h-4 w-4 fill-current" />
            <span className="text-primary-foreground text-sm font-semibold">
              Mais escolhido
            </span>
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col text-center">
        <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {plan.description}
        </p>
        <div className="mt-6 flex items-baseline justify-center gap-x-1">
          <span className="text-5xl font-bold tracking-tight text-foreground">
            <NumberFlow
              value={isMonthly ? Number(plan.price) : Number(plan.yearlyPrice)}
              locales="pt-BR"
              format={{
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }}
              className="tabular-nums"
            />
          </span>
          <span className="text-sm font-semibold leading-6 tracking-wide text-muted-foreground">
            / {plan.period}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {isMonthly ? "Cobrança mensal" : "Cobrança anual"}
          {plan.note ? ` · ${plan.note}` : ""}
        </p>

        <ul
          role="list"
          className="mt-8 space-y-3 text-sm leading-6 text-left text-muted-foreground"
        >
          {plan.features.map((feature) => (
            <li key={feature} className="flex gap-x-3">
              <Check
                className="h-6 w-5 flex-none text-primary"
                aria-hidden="true"
              />
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-8">
          <Link
            href={plan.href}
            className={cn(
              buttonVariants({
                variant: plan.isPopular ? "default" : "outline",
                size: "lg",
              }),
              "w-full",
            )}
          >
            {plan.buttonText}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
