import { HelpCircle, MessageSquare, Globe, Settings, Volume2, Eye, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const faqData = [
  {
    question: "How do I find my polling place?",
    answer: "Enter your ZIP code in the polling place finder on the Deadlines page. You can also text your address to our SMS line for instant results.",
    language: "English"
  },
  {
    question: "What documents do I need to vote?",
    answer: "Requirements vary by state. Most states accept a driver's license, state ID, or passport. Some states allow utility bills or bank statements. Check your state's specific requirements.",
    language: "English"
  },
  {
    question: "Can I vote by mail?",
    answer: "Yes, in most states you can request an absentee ballot. Some states require a reason, others allow no-excuse absentee voting. Check your state's rules and deadlines.",
    language: "English"
  },
  {
    question: "¿Dónde puedo votar?",
    answer: "Ingrese su código postal en el buscador de lugares de votación en la página de Fechas Importantes. También puede enviar su dirección por SMS para obtener resultados instantáneos.",
    language: "Spanish"
  },
  {
    question: "我需要什么文件才能投票？",
    answer: "要求因州而异。大多数州接受驾驶执照、州身份证或护照。一些州允许使用水电费账单或银行对账单。请查看您所在州的具体要求。",
    language: "Chinese"
  }
];

const smsShortcodes = [
  { code: "VOTE", description: "Find your polling place", example: "Text VOTE 12345" },
  { code: "DEADLINE", description: "Get important voting deadlines", example: "Text DEADLINE" },
  { code: "REGISTER", description: "Check registration status", example: "Text REGISTER" },
  { code: "ID", description: "Learn about ID requirements", example: "Text ID" },
  { code: "EARLY", description: "Find early voting locations", example: "Text EARLY 12345" }
];

const languages = [
  { code: "en", name: "English", flag: "🇺🇸", native: "English" },
  { code: "es", name: "Spanish", flag: "🇪🇸", native: "Español" },
  { code: "zh", name: "Chinese", flag: "🇨🇳", native: "中文" },
  { code: "ar", name: "Arabic", flag: "🇸🇦", native: "العربية" },
  { code: "hi", name: "Hindi", flag: "��🇳", native: "हिन्दी" },
  { code: "ko", name: "Korean", flag: "🇰🇷", native: "한국어" },
  { code: "vi", name: "Vietnamese", flag: "🇻🇳", native: "Tiếng Việt" },
  { code: "tl", name: "Tagalog", flag: "🇵🇭", native: "Tagalog" }
];

export default function HelpAndLanguage() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Help & Language Settings</h1>
            <p className="text-muted-foreground">
              Get support and customize your experience
            </p>
          </div>

          {/* Language Selection */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Language Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Language</label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <div className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                            <span className="text-muted-foreground">({lang.native})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Current Language</label>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <span className="text-2xl">
                      {languages.find(l => l.code === selectedLanguage)?.flag}
                    </span>
                    <span className="font-medium">
                      {languages.find(l => l.code === selectedLanguage)?.name}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accessibility Settings */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Accessibility Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5" />
                    <div>
                      <p className="font-medium">High Contrast Mode</p>
                      <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                    </div>
                  </div>
                  <Switch checked={highContrast} onCheckedChange={setHighContrast} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Type className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Large Text</p>
                      <p className="text-sm text-muted-foreground">Increase text size for easier reading</p>
                    </div>
                  </div>
                  <Switch checked={largeText} onCheckedChange={setLargeText} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Volume2 className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Audio Enabled</p>
                      <p className="text-sm text-muted-foreground">Enable spoken instructions</p>
                    </div>
                  </div>
                  <Switch checked={audioEnabled} onCheckedChange={setAudioEnabled} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-lg font-semibold">{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* SMS Shortcodes */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                SMS Shortcodes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {smsShortcodes.map((shortcode, index) => (
                  <div key={index} className="p-4 bg-muted rounded-lg">
                    <p className="font-medium mb-1">{shortcode.code}</p>
                    <p className="text-sm text-muted-foreground">{shortcode.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">Example: {shortcode.example}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" className="flex-1 sm:flex-none">
              <MessageSquare className="h-5 w-5 mr-2" />
              Contact Support
            </Button>
            <Button variant="outline" size="lg" className="flex-1 sm:flex-none">
              <HelpCircle className="h-5 w-5 mr-2" />
              View All FAQs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
