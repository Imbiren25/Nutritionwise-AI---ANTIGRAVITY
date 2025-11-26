import React from 'react';
import Icon from './Icon';
import Logo from './Logo';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import Badge from './ui/Badge';
import { cn } from '@/lib/utils';

interface LandingPageProps {
  onNavigate: (flow: 'landing' | 'login' | 'signup' | 'new-password') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-8 flex h-16 items-center justify-between max-w-7xl">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <Logo className="h-5 w-5" />
            </div>
            <button
              aria-label="Go to home"
              onClick={() => onNavigate('landing')}
              className="text-xl font-bold tracking-tight hover:text-primary transition-colors"
            >
              NutritionWise
            </button>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => onNavigate('login')} className="hidden md:flex">
              Log in
            </Button>
            <Button onClick={() => onNavigate('signup')} className="rounded-full px-6 shadow-lg shadow-primary/20">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
          {/* Animated Background Gradients */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/20 via-blue-500/20 to-transparent rounded-full blur-3xl animate-blob"></div>
            <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/15 via-pink-500/15 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/2 w-[550px] h-[550px] bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-transparent rounded-full blur-3xl animate-blob animation-delay-4000"></div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          </div>

          <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
            <div className="flex flex-col items-center text-center space-y-8 max-w-5xl mx-auto">
              {/* Badge */}
              <div className="group inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm px-4 py-1.5 text-sm font-medium transition-all hover:border-primary/40 hover:bg-primary/10 animate-fade-in-up">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-foreground">v2.0 Now Available</span>
                <Icon name="arrowForward" className="h-3 w-3 text-primary group-hover:translate-x-0.5 transition-transform" />
              </div>

              {/* Main Heading */}
              <div className="space-y-6 animate-fade-in-up delay-100">
                <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight leading-tight">
                  <span className="block text-foreground">Scientific Nutrition.</span>
                  <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-purple-600 animate-gradient-x">
                    Simplified for India.
                  </span>
                </h1>

                <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
                  The professional platform for <span className="text-foreground font-semibold">24-hour dietary recalls</span>, <span className="text-foreground font-semibold">CU-based stock inventory</span>, and <span className="text-foreground font-semibold">AI-powered diet recommendations</span>.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-up delay-200">
                <Button
                  size="lg"
                  onClick={() => onNavigate('signup')}
                  className="group relative rounded-full px-8 h-14 text-base font-semibold shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Free Trial
                    <Icon name="arrowForward" className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate('login')}
                  className="rounded-full px-8 h-14 text-base font-semibold border-2 hover:bg-secondary/80 backdrop-blur-sm"
                >
                  Log In
                </Button>
              </div>

              {/* Feature Highlights */}
              <div className="pt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl animate-fade-in-up delay-300">
                {[
                  { icon: "zap", label: "Instant Analysis", desc: "Real-time nutrient calculation" },
                  { icon: "lock", label: "Secure & Private", desc: "WCAG 2.1 AA Compliant" }
                ].map((item, i) => (
                  <div
                    key={i}
                    className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:border-primary/50 hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon name={item.icon as any} className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 flex flex-wrap justify-center gap-8 opacity-70 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <div className="h-8 w-8 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center">
                    <Icon name="check-circle" className="h-5 w-5" />
                  </div>
                  <span>WCAG 2.1 AA</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <div className="h-8 w-8 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <Icon name="lock" className="h-5 w-5" />
                  </div>
                  <span>Secure Encryption</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <div className="h-8 w-8 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center">
                    <Icon name="sparkles" className="h-5 w-5" />
                  </div>
                  <span>AI-Powered</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section className="py-12 md:py-24 bg-secondary/30 border-y">
          <div className="container mx-auto px-4 md:px-8 max-w-6xl">
            <div className="relative rounded-2xl border bg-background shadow-2xl overflow-hidden">
              <div className="absolute top-0 w-full h-12 bg-muted/50 border-b flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="pt-12 p-8 md:p-12 grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    <Icon name="sparkles" className="mr-2 h-4 w-4" />
                    AI-Powered Analysis
                  </div>
                  <h3 className="text-3xl font-bold tracking-tight">Deep Insights, Instant Results</h3>
                  <p className="text-muted-foreground text-lg">
                    Our advanced algorithms analyze dietary patterns against Indian food databases to provide actionable health insights in seconds.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Real-time nutrient calculation",
                      "Deficit & surplus identification",
                      "Personalized diet recommendations"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                          <Icon name="check-circle" className="h-4 w-4" />
                        </div>
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative">
                  {/* Mock Card */}
                  <Card className="shadow-xl border-muted">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon name="description" className="h-5 w-5 text-primary" />
                        Daily Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="rounded-lg bg-muted p-3 text-center">
                          <div className="text-2xl font-bold text-primary">1,860</div>
                          <div className="text-xs text-muted-foreground">Calories</div>
                        </div>
                        <div className="rounded-lg bg-muted p-3 text-center">
                          <div className="text-2xl font-bold text-blue-600">85g</div>
                          <div className="text-xs text-muted-foreground">Protein</div>
                        </div>
                        <div className="rounded-lg bg-muted p-3 text-center">
                          <div className="text-2xl font-bold text-green-600">A+</div>
                          <div className="text-xs text-muted-foreground">Score</div>
                        </div>
                      </div>
                      <div className="rounded-lg bg-primary/5 p-4 border border-primary/10">
                        <p className="text-sm font-medium text-primary mb-1">AI Insight</p>
                        <p className="text-xs text-muted-foreground">Protein intake is optimal. Consider increasing fiber-rich vegetables.</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24">
          <div className="container mx-auto px-4 md:px-8 max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Everything you need</h2>
              <p className="text-lg text-muted-foreground">
                Powerful tools designed for nutritionists, dietitians, and health conscious individuals.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: "clipboard",
                  title: "24-Hour Recall",
                  desc: "Effortlessly log daily food intake with our intuitive interface. Auto-calculation of nutrients based on Indian food databases.",
                  color: "text-blue-500",
                  bg: "bg-blue-500/10"
                },
                {
                  icon: "archive",
                  title: "Smart Inventory",
                  desc: "Manage household stock with Consumption Unit (CU) precision. Track inventory levels and get restocking alerts.",
                  color: "text-orange-500",
                  bg: "bg-orange-500/10"
                },
                {
                  icon: "sparkles",
                  title: "AI Recommendations",
                  desc: "Receive personalized, science-backed diet suggestions powered by advanced AI algorithms to meet health goals.",
                  color: "text-purple-500",
                  bg: "bg-purple-500/10"
                }
              ].map((feature, i) => (
                <Card key={i} className="border-muted/50 hover:border-primary/50 transition-colors duration-300">
                  <CardHeader>
                    <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4", feature.bg, feature.color)}>
                      <Icon name={feature.icon as any} className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="container mx-auto px-4 text-center relative z-10 max-w-4xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Ready to transform your nutrition journey?</h2>
            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
              Join thousands of professionals using NutritionWise AI to make data-driven health decisions.
            </p>
            <Button size="lg" variant="secondary" onClick={() => onNavigate('signup')} className="rounded-full px-10 h-14 text-lg font-semibold shadow-xl hover:scale-105 transition-transform">
              Get Started for Free
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                  <Logo className="h-5 w-5" />
                </div>
                <button
                  aria-label="Go to home"
                  onClick={() => onNavigate('landing')}
                  className="text-xl font-bold hover:text-primary transition-colors"
                >
                  NutritionWise
                </button>
              </div>
              <p className="text-muted-foreground max-w-xs">
                Empowering India with smarter nutrition data and analysis tools.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button className="hover:text-primary transition-colors">Features</button></li>
                <li><button className="hover:text-primary transition-colors">Pricing</button></li>
                <li><button className="hover:text-primary transition-colors">Testimonials</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button className="hover:text-primary transition-colors">Privacy Policy</button></li>
                <li><button className="hover:text-primary transition-colors">Terms of Service</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} NutritionWise AI. All rights reserved.</p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
                <Icon name="twitter" className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
                <Icon name="linkedin" className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
