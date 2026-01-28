import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight, BarChart3, Search, FileText, MessageSquare, BrainCircuit, Users, Clock, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// セミナー情報の定義
const seminar = {
  id: "vol1",
  title: "「提案の属人化」を脱却する",
  subtitle: "～赤字案件を防ぎ、利益体質の営業組織へ～",
  date: "2026年2月3日(火)",
  time: "14:00～15:00",
  image: "/seminar-vol1.png",
  description: "RFP作成・要件定義・見積もり精度をAIが劇的に改善。提案スピードを2倍にする実践メソッドを解説！"
};

export default function Home() {

  const [formData, setFormData] = useState({
    company: "",
    name: "",
    position: "",
    email: "",
    phone: "",
    challenge: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitRegistration = trpc.seminar.submitRegistration.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (formErrors[id]) {
      setFormErrors(prev => ({ ...prev, [id]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.company.trim()) errors.company = "会社名は必須です";
    if (!formData.name.trim()) errors.name = "名前は必須です";
    if (!formData.position.trim()) errors.position = "役職は必須です";
    if (!formData.email.trim()) errors.email = "メールアドレスは必須です";
    if (!formData.email.includes("@")) errors.email = "有効なメールアドレスを入力してください";
    if (!formData.phone.trim()) errors.phone = "電話番号は必須です";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await submitRegistration.mutateAsync({
        company: formData.company,
        name: formData.name,
        position: formData.position,
        email: formData.email,
        phone: formData.phone,
        challenge: formData.challenge,
      });

      if (result.success) {
        toast.success("申し込みが完了しました。確認メールをご確認ください。");
        setFormData({
          company: "",
          name: "",
          position: "",
          email: "",
          phone: "",
          challenge: "",
        });
      } else {
        toast.error("申し込み処理中にエラーが発生しました。もう一度お試しください。");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("申し込み処理中にエラーが発生しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900 text-white">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-bg.jpg" 
            alt="SI Development Control Room" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/30" />
          
          {/* Animated Tech Lines */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-1/4 left-0 w-full h-[1px] bg-cyan-500/50" />
            <div className="absolute top-3/4 left-0 w-full h-[1px] bg-cyan-500/50" />
            <div className="absolute top-0 left-1/4 w-[1px] h-full bg-cyan-500/50" />
            <div className="absolute top-0 right-1/4 w-[1px] h-full bg-cyan-500/50" />
          </div>
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge variant="outline" className="mb-6 px-6 py-2 text-sm border-cyan-500 text-cyan-400 bg-cyan-500/10">
              anyenv株式会社主催ウェビナー
            </Badge>
            
            <div className="mb-8">
              <p className="text-cyan-400 text-lg mb-2">SI・開発DXウェビナー 営業改革シリーズ</p>
              <Badge className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-2 text-base">
                参加無料
              </Badge>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              提案の属人化を脱却し<br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                利益体質の営業組織へ
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-3xl mx-auto">
              RFP作成・要件定義・見積もり精度を、AIが劇的に改善。<br />
              赤字案件を防ぎ、提案スピードを2倍にする実践メソッドを解説！
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                onClick={() => document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                今すぐ申し込む（無料）
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-cyan-500 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-cyan-500 rounded-full" />
          </div>
        </div>
      </section>

      {/* Seminar Details Section */}
      <section className="py-20 bg-slate-50">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">セミナー概要</h2>
            <div className="w-20 h-1 bg-cyan-600 mx-auto mt-6" />
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-cyan-500 shadow-xl overflow-hidden">
              <div className="relative h-64 md:h-80">
                <img 
                  src={seminar.image} 
                  alt={seminar.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <Badge className="bg-cyan-600 text-white mb-3">
                    {seminar.date} {seminar.time}
                  </Badge>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {seminar.title}
                  </h3>
                  <p className="text-slate-200 text-sm md:text-base">
                    {seminar.subtitle}
                  </p>
                </div>
              </div>
              <CardContent className="p-8">
                <p className="text-slate-700 text-lg leading-relaxed mb-6">
                  {seminar.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="outline" className="text-sm px-4 py-2">
                    <Clock className="w-4 h-4 mr-2" />
                    60分
                  </Badge>
                  <Badge variant="outline" className="text-sm px-4 py-2">
                    <Users className="w-4 h-4 mr-2" />
                    オンライン開催
                  </Badge>
                  <Badge variant="outline" className="text-sm px-4 py-2">
                    <Target className="w-4 h-4 mr-2" />
                    SI・開発企業向け
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl" />
        </div>

        <div className="container px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              SI営業の「見えない赤字」、放置していませんか?
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              中堅企業の70%が抱える、営業プロセスの4大課題
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
          >
            <motion.div variants={fadeIn}>
              <Card className="bg-slate-800/50 border-cyan-500/30 hover:border-cyan-500 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 h-full backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl mb-4 flex items-center gap-3">
                    <Clock className="w-8 h-8 text-cyan-400" />
                    RFP作成時の予算感欠如
                  </CardTitle>
                  <CardDescription className="text-base text-slate-300 leading-relaxed">
                    予算感なしでRFPを作成すると、ベンダ見積が数倍にばらつき、選定が1年以上長期化。プロジェクト遅延リスクは2倍以上に。
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="bg-slate-800/50 border-blue-500/30 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 h-full backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl mb-4 flex items-center gap-3">
                    <Search className="w-8 h-8 text-blue-400" />
                    要件定義の属人化と情報点在
                  </CardTitle>
                  <CardDescription className="text-base text-slate-300 leading-relaxed">
                    営業・SE個人の勘に依存し、情報が点在。提案内容・価格がブレて粗利が不安定化。若手が一人前になるまで数年かかる。
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="bg-slate-800/50 border-purple-500/30 hover:border-purple-500 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 h-full backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl mb-4 flex items-center gap-3">
                    <FileText className="w-8 h-8 text-purple-400" />
                    見積もり精度の低さとリスク把握不足
                  </CardTitle>
                  <CardDescription className="text-base text-slate-300 leading-relaxed">
                    見積精度がブラックボックス化し、赤字案件が発生。開発リスク（技術難易度、仕様変更、テスト工数）の把握が不十分。
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="bg-slate-800/50 border-green-500/30 hover:border-green-500 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20 h-full backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl mb-4 flex items-center gap-3">
                    <Users className="w-8 h-8 text-green-400" />
                    提案書作成の非効率と品質ばらつき
                  </CardTitle>
                  <CardDescription className="text-base text-slate-300 leading-relaxed">
                    トップ営業の暗黙知が形式知化されず、提案の出し遅れで失注。テンプレートなく毎回ゼロから作成し、商談準備に追われる。
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mt-16 text-center"
          >
            <Card className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border-red-500/50 max-w-3xl mx-auto backdrop-blur-sm">
              <CardContent className="p-8">
                <p className="text-lg text-slate-200 leading-relaxed">
                  <strong className="text-red-400">統計データ:</strong> 中堅企業の約<strong className="text-red-400">70%</strong>がRFP作成で課題を抱え、予算感を持つ企業はプロジェクト成功率が<strong className="text-red-400">30%高い</strong>。成功プロジェクトの<strong className="text-red-400">80%以上</strong>は問題の明確化と利益の特定が行われている。
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="py-20 bg-white">
        <div className="container px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              このセミナーで学べること
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              予算感を持った企業はプロジェクト成功率が30%高い。AIで営業を再現設計する実践ノウハウ
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
              className="space-y-6"
            >
              <motion.div variants={fadeIn}>
                <Card className="border-l-4 border-l-cyan-600 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <CheckCircle2 className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-slate-900">RFP作成の予算感形成</h3>
                        <p className="text-slate-600 leading-relaxed">
                          IT導入の利益（ROI）を明確化し、金額換算して妥当な予算を算出する方法。「今回のIT導入がもたらす具体的な利益は何か?」という問いに答え、ベンダ選定を迅速化。
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card className="border-l-4 border-l-blue-600 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-slate-900">要件定義の脱属人化</h3>
                        <p className="text-slate-600 leading-relaxed">
                          トップ営業の思考をテンプレート化し、接点情報を一元化・自動記録する仕組み。顧客の真の課題を深掘りし、情報の点在・漏れ・継承不能を解消。
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card className="border-l-4 border-l-purple-600 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <CheckCircle2 className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-slate-900">見積もり精度の向上</h3>
                        <p className="text-slate-600 leading-relaxed">
                          開発リスクを可視化し、工数を細分化して正確な見積を作成する手法。「一式見積」を脱却し、技術的難易度・仕様変更・テスト工数を明確化して赤字案件を防止。
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card className="border-l-4 border-l-green-600 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-slate-900">提案書の再現設計</h3>
                        <p className="text-slate-600 leading-relaxed">
                          AIが「次の一手」を提示し、提案スピードを2倍にする営業プロセス改革。過去の成功事例を学習させ、顧客に最適化された提案書を自動生成。
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card className="border-l-4 border-l-orange-600 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <BrainCircuit className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-slate-900">Gemini活用の実践デモ</h3>
                        <p className="text-slate-600 leading-relaxed">
                          RFP作成、要件定義、見積もり作成の各場面で、Geminiをどう活用するか実際の画面を見ながら解説。すぐに実践できる具体的なプロンプトと活用法を公開。
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50">
        <div className="container px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">よくある質問</h2>
            <div className="w-20 h-1 bg-cyan-600 mx-auto mt-6" />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeIn}
            className="max-w-3xl mx-auto"
          >
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-white border border-slate-200 rounded-lg px-6">
                <AccordionTrigger className="text-lg font-semibold hover:text-cyan-600">
                  このセミナーはどのような方が対象ですか？
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed">
                  SI・開発企業の営業担当者、営業マネージャー、プリセールスSE、経営層の方が対象です。特に、RFP作成・要件定義・見積もりに課題を感じている方、提案の属人化を解消したい方に最適です。
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-white border border-slate-200 rounded-lg px-6">
                <AccordionTrigger className="text-lg font-semibold hover:text-cyan-600">
                  Geminiを使ったことがなくても参加できますか？
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed">
                  はい、問題ありません。セミナーでは基本的な使い方から実践的な活用法まで、実際の画面を見ながら丁寧に解説します。すぐに実践できる具体的なプロンプトもご紹介します。
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-white border border-slate-200 rounded-lg px-6">
                <AccordionTrigger className="text-lg font-semibold hover:text-cyan-600">
                  セミナー後のフォローはありますか？
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed">
                  はい。セミナー後に実践ガイド資料をお送りします。また、ご希望の方には個別相談の機会もご用意しています。
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-white border border-slate-200 rounded-lg px-6">
                <AccordionTrigger className="text-lg font-semibold hover:text-cyan-600">
                  録画視聴は可能ですか？
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed">
                  はい、当日参加できない方にも録画視聴のURLをお送りします。お申し込み時にその旨をお知らせください。
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-white border border-slate-200 rounded-lg px-6">
                <AccordionTrigger className="text-lg font-semibold hover:text-cyan-600">
                  自社の課題に合わせたアドバイスはもらえますか？
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed">
                  セミナー内のQ&Aセッションで個別の質問にお答えします。また、申込フォームの「現在の課題」欄にご記入いただければ、セミナー内容に反映させていただきます。
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section id="registration-form" className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">参加申し込み</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              完全無料・オンライン開催。今すぐお申し込みください。
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeIn}
            className="max-w-2xl mx-auto"
          >
            <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-white">申し込みフォーム</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2 text-slate-200">
                      会社名 <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-slate-400"
                      placeholder="〇〇システム株式会社"
                    />
                    {formErrors.company && (
                      <p className="mt-2 text-sm text-red-400">{formErrors.company}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2 text-slate-200">
                      お名前 <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-slate-400"
                      placeholder="山田 太郎"
                    />
                    {formErrors.name && (
                      <p className="mt-2 text-sm text-red-400">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="position" className="block text-sm font-medium mb-2 text-slate-200">
                      役職 <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-slate-400"
                      placeholder="営業部長"
                    />
                    {formErrors.position && (
                      <p className="mt-2 text-sm text-red-400">{formErrors.position}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2 text-slate-200">
                      メールアドレス <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-slate-400"
                      placeholder="yamada@example.com"
                    />
                    {formErrors.email && (
                      <p className="mt-2 text-sm text-red-400">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2 text-slate-200">
                      電話番号 <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-slate-400"
                      placeholder="03-1234-5678"
                    />
                    {formErrors.phone && (
                      <p className="mt-2 text-sm text-red-400">{formErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="challenge" className="block text-sm font-medium mb-2 text-slate-200">
                      現在の課題（任意）
                    </label>
                    <textarea
                      id="challenge"
                      value={formData.challenge}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-slate-400 resize-none"
                      placeholder="例：RFP作成に時間がかかる、見積もり精度が低い、要件定義が属人化している など"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white py-6 text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "送信中..." : "今すぐ申し込む（無料）"}
                    {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="container px-4">
          <div className="text-center">
            <p className="text-sm mb-4">
              主催: anyenv株式会社
            </p>
            <p className="text-sm">
              お問い合わせ: <a href="mailto:info@anyenv-inc.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">info@anyenv-inc.com</a>
            </p>
            <p className="text-xs mt-6 text-slate-500">
              © 2026 anyenv Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
