import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageSquare,
  Sparkles,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useState, useEffect } from "react";
import scifiGrid from "/scifi-grid-bg.jpg";
import { lerp } from "@/utils/helper";

const Index = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let target = { x: 0, y: 0 };
    let rafId: number;

    const handlePointerMove = (e: PointerEvent) => {
      target = {
        x: e.clientX + window.scrollX,
        y: e.clientY + window.scrollY,
      };
    };

    const animate = () => {
      setMousePosition((prev) => {
        const x = lerp(prev.x, target.x, 0.1);
        const y = lerp(prev.y, target.y, 0.1);

        return { x, y };
      });

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    animate();

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const features = [
    {
      icon: Sparkles,
      title: "Advanced AI",
      description:
        "Powered by state-of-the-art language models for intelligent, context-aware conversations",
    },
    {
      icon: Zap,
      title: "Instant Response",
      description:
        "Lightning-fast replies with minimal latency for seamless real-time interaction",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "End-to-end encryption ensures your conversations remain completely confidential",
    },
  ];

  const benefits = [
    "Unlimited conversations",
    "Smart context retention",
    "Multi-device sync",
    "Priority support",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="h-[calc(100vh-65px)] flex items-center justify-center px-4 relative overflow-hidden bg-radial from-primary/10 via-background to-background">
        {/* Sci-fi grid background with mouse reveal - desktop only */}
        <div
          className="hidden md:block absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `url(${scifiGrid})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            maskImage: `radial-gradient(circle 300px at ${mousePosition.x}px ${mousePosition.y}px, rgba(0,0,0,0.5) 0%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(circle 300px at ${mousePosition.x}px ${mousePosition.y}px, rgba(0,0,0,0.5) 0%, transparent 100%)`,
          }}
        />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center space-y-8">
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                Welcome to the Future of AI Chat
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Your Intelligent
              <span className="block mt-2 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Conversation Partner
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Experience natural, intelligent conversations powered by advanced
              AI. Get instant answers, creative ideas, and thoughtful
              discussions.
            </p>

            <div className="flex gap-4 justify-center flex-wrap pt-4">
              <Button
                size="lg"
                onClick={() => navigate("/chat")}
                className="text-lg px-8 py-6 group"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Start Chatting
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6"
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground text-lg">
              Powerful features designed for seamless AI interaction
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="relative overflow-hidden border-2 bg-card/50 backdrop-blur transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1"
              >
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Why Choose Our AI Assistant?
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Built for everyone who values intelligent, reliable, and secure
                conversations. Experience the difference with features designed
                around your needs.
              </p>
              <ul className="space-y-4 pt-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
              <CardContent className="p-8 md:p-12">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="text-5xl font-bold text-primary">24/7</div>
                    <p className="text-muted-foreground">
                      Always available when you need assistance
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-5xl font-bold text-primary">∞</div>
                    <p className="text-muted-foreground">
                      Unlimited conversations and messages
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-5xl font-bold text-primary">
                      &lt;1s
                    </div>
                    <p className="text-muted-foreground">
                      Average response time
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold">
            Ready to Get Started?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of users having smarter conversations every day
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/chat")}
            className="text-lg px-10 py-7 group"
          >
            Start Your First Chat
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-card/50">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">
            &copy; 2025 AI Chat Assistant. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
