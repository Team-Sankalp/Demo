import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Wifi, 
  Shield, 
  Users, 
  TrendingUp, 
  Package, 
  AlertTriangle,
  CheckCircle,
  ArrowRight
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Package,
      title: "Product Management",
      description: "Comprehensive inventory tracking with real-time stock levels and automated reorder points.",
    },
    {
      icon: Users,
      title: "Supplier Management",
      description: "Maintain detailed supplier records with contact information and order history.",
    },
    {
      icon: AlertTriangle,
      title: "Smart Alerts",
      description: "Automated notifications for low stock levels and pending orders.",
    },
    {
      icon: TrendingUp,
      title: "Analytics & Reports",
      description: "Detailed insights into inventory turnover and demand forecasting.",
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description: "Secure access control with Admin, Manager, and Staff permission levels.",
    },
    {
      icon: CheckCircle,
      title: "Data Validation",
      description: "Input validation and secure handling of sensitive data.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Wifi className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-primary-foreground">TIMS</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline" className="bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-accent hover:bg-accent-hover">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-white/10 text-primary-foreground border-white/20">
            Professional Telecom Solution
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
            Telecom Inventory
            <span className="block text-accent">Management System</span>
          </h1>
          
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Streamline your telecom equipment inventory with our comprehensive management system. 
            Track products, manage suppliers, and receive smart alerts for optimal stock levels.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-accent hover:bg-accent-hover text-lg px-8 py-3">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20 text-lg px-8 py-3">
                Sign In to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Powerful Features for Modern Telecom
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Everything you need to manage your telecom inventory efficiently and effectively.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/10 border-white/20 shadow-strong hover:bg-white/15 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-accent rounded-lg">
                    <feature.icon className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <CardTitle className="text-primary-foreground">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-primary-foreground/70">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <Card className="bg-white/10 border-white/20 shadow-strong max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl text-primary-foreground">
              Ready to Optimize Your Inventory?
            </CardTitle>
            <CardDescription className="text-primary-foreground/80 text-lg">
              Join hundreds of telecom companies already using TIMS to streamline their operations.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-accent text-lg px-8 py-3">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-white/20">
        <div className="text-center text-primary-foreground/60">
          <p>&copy; 2024 TIMS - Telecom Inventory Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
