"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, Heart, Smile, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Envio Direto",
      description: "Envie stickers diretamente para WhatsApp com um clique"
    },
    {
      icon: <Smile className="h-6 w-6" />,
      title: "Templates Brasileiros",
      description: "Memes, gírias e expressões que todo brasileiro conhece"
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Otimizado WhatsApp",
      description: "Formato WebP, 512x512px, menos de 100KB automaticamente"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Fácil de Usar",
      description: "Interface intuitiva, funciona perfeitamente no celular"
    }
  ];

  const templates = [
    { emoji: "😂", name: "Reações Engraçadas", count: 25 },
    { emoji: "❤️", name: "Românticos", count: 18 },
    { emoji: "💼", name: "Trabalho", count: 12 },
    { emoji: "🎉", name: "Comemorações", count: 15 },
    { emoji: "🤔", name: "Dúvidas", count: 20 },
    { emoji: "👍", name: "Aprovação", count: 16 }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            Novo! Envio direto para WhatsApp
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Crie Stickers para
            <span className="text-green-600 block">WhatsApp</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            O jeito mais fácil de criar stickers personalizados para WhatsApp. 
            Templates brasileiros, otimização automática e envio direto para seus contatos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/editor">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Começar a Criar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/templates">
              <Button variant="outline" size="lg">
                Ver Templates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Editor Profissional
                </h2>
                <p className="text-gray-600 mb-6">
                  Ferramentas completas para criar stickers únicos. Desenhe, 
                  adicione texto, upload imagens e veja o resultado em tempo real 
                  como ficará no WhatsApp.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Canvas 512x512px otimizado
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Ferramentas de desenho avançadas
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Preview em tempo real no WhatsApp
                  </li>
                </ul>
              </div>
              <div className="bg-gray-100 rounded-xl p-6 flex items-center justify-center">
                <img 
                  src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/35e43dd5-cea4-47e8-8c2a-3633a9ee5547.png" 
                  alt="Preview do editor de stickers com canvas 512x512 e ferramentas de desenho"
                  className="rounded-lg shadow-lg max-w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que escolher nosso criador?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Desenvolvido especificamente para o WhatsApp brasileiro, 
              com todas as otimizações necessárias.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full text-green-600 w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Templates Populares
            </h2>
            <p className="text-gray-600">
              Comece com nossos templates criados especialmente para o público brasileiro
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {templates.map((template, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-4xl mb-2">{template.emoji}</div>
                  <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
                  <p className="text-xs text-gray-500">{template.count} opções</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Link href="/templates">
              <Button variant="outline" size="lg">
                Ver Todos os Templates
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Pronto para criar seus stickers?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Comece agora e surpreenda seus amigos com stickers únicos!
            </p>
            <Link href="/editor">
              <Button size="lg" variant="secondary">
                Criar Meu Primeiro Sticker
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}