import Link from "next/link";
import { ChevronLeft, BookMarked, ExternalLink, BookOpen, FileText, Globe } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

interface Referencia {
  titulo: string;
  tipo: "guideline" | "livro" | "estudo" | "base";
  organizacao: string;
  ano?: string;
  descricao: string;
  url?: string;
  categorias: string[];
}

const referencias: Referencia[] = [
  // Guidelines
  {
    titulo: "APA Practice Guidelines",
    tipo: "guideline",
    organizacao: "American Psychiatric Association",
    ano: "2023",
    descricao: "Guidelines para depressão maior, TAB, esquizofrenia, TEPT e outros transtornos — padrão de referência norte-americano.",
    url: "https://www.psychiatry.org/psychiatrists/practice/clinical-practice-guidelines",
    categorias: ["TDM", "TAB", "Esquizofrenia", "TEPT", "Ansiedade"],
  },
  {
    titulo: "CANMAT Guidelines",
    tipo: "guideline",
    organizacao: "Canadian Network for Mood and Anxiety Treatments",
    ano: "2016–2023",
    descricao: "Guidelines CANMAT para depressão (2016, 2023), bipolar (2018) e TDAH (2021) — amplamente utilizados na psiquiatria latino-americana.",
    url: "https://www.canmat.org/resources/clinical-guidelines/",
    categorias: ["TDM", "TAB", "TDAH", "Ansiedade"],
  },
  {
    titulo: "NICE Guidelines — Psiquiatria",
    tipo: "guideline",
    organizacao: "National Institute for Health and Care Excellence (UK)",
    descricao: "Guidelines NICE para depressão, esquizofrenia, TAB, ansiedade e demências — baseados em evidências do NHS.",
    url: "https://www.nice.org.uk/guidance/mental-health-and-behavioural-conditions",
    categorias: ["TDM", "Esquizofrenia", "TAB", "Demências", "Ansiedade"],
  },
  {
    titulo: "BAP Guidelines",
    tipo: "guideline",
    organizacao: "British Association for Psychopharmacology",
    descricao: "Guidelines de psicofarmacologia britânicos: depressão, TAB, esquizofrenia, ansiedade, insônia e farmacoterapia na gestação.",
    url: "https://www.bap.org.uk/guidelines.php",
    categorias: ["TDM", "TAB", "Gestação", "Insônia"],
  },
  {
    titulo: "WFSBP Guidelines",
    tipo: "guideline",
    organizacao: "World Federation of Societies of Biological Psychiatry",
    descricao: "Guidelines internacionais WFSBP para depressão, TAB, esquizofrenia, demências e ansiedade.",
    url: "https://www.wfsbp.org/guidelines/",
    categorias: ["TDM", "TAB", "Esquizofrenia", "Demências"],
  },
  {
    titulo: "CFM — Resoluções e Pareceres",
    tipo: "guideline",
    organizacao: "Conselho Federal de Medicina (Brasil)",
    descricao: "Normas regulatórias brasileiras relevantes para prescrição psiquiátrica, portarias especiais e documentos de consenso.",
    url: "https://www.cfm.org.br",
    categorias: ["Regulatório", "Brasil"],
  },

  // Livros
  {
    titulo: "Stahl's Essential Psychopharmacology",
    tipo: "livro",
    organizacao: "Stephen M. Stahl",
    ano: "5ª ed. 2021",
    descricao: "Referência visual de psicofarmacologia clínica — mecanismos, indicações e comparações de moléculas com iconografia exclusiva.",
    categorias: ["Mecanismos", "Receptores", "Moléculas"],
  },
  {
    titulo: "The Maudsley Prescribing Guidelines",
    tipo: "livro",
    organizacao: "Taylor, Barnes & Young",
    ano: "14ª ed. 2021",
    descricao: "Guia prático de prescrição psiquiátrica do Maudsley Hospital — populações especiais, gestação, interações e situações complexas.",
    categorias: ["Prescrição", "Gestação", "Populações especiais", "Interações"],
  },
  {
    titulo: "Manual de Psicofarmacologia Clínica — ABPMC",
    tipo: "livro",
    organizacao: "Associação Brasileira de Psiquiatria",
    descricao: "Manual brasileiro de referência para psicofarmacologia com adaptações ao contexto clínico nacional.",
    categorias: ["Brasil", "Moléculas", "Clínico"],
  },
  {
    titulo: "Kaplan & Sadock's Comprehensive Textbook of Psychiatry",
    tipo: "livro",
    organizacao: "Sadock, Sadock & Ruiz",
    ano: "10ª ed. 2017",
    descricao: "Textbook enciclopédico de psiquiatria — transtornos, classificações, neurobiologia e tratamento.",
    categorias: ["Transtornos", "Neurobiologia", "Diagnóstico"],
  },

  // Estudos-chave
  {
    titulo: "STAR*D — Sequenced Treatment Alternatives to Relieve Depression",
    tipo: "estudo",
    organizacao: "NIMH",
    ano: "2006",
    descricao: "Maior estudo pragmático de depressão — algoritmo de escalonamento de antidepressivos em 4.041 pacientes. Base para algoritmos de depressão resistente.",
    url: "https://pubmed.ncbi.nlm.nih.gov/16418499/",
    categorias: ["TDM", "Resistência", "ISRS", "Augmentação"],
  },
  {
    titulo: "CATIE — Clinical Antipsychotic Trials of Intervention Effectiveness",
    tipo: "estudo",
    organizacao: "NIMH",
    ano: "2005",
    descricao: "Estudo head-to-head de antipsicóticos em esquizofrenia (N=1.493) — efetividade pragmática de AP 1G vs 2G.",
    url: "https://pubmed.ncbi.nlm.nih.gov/16171984/",
    categorias: ["Esquizofrenia", "Antipsicóticos"],
  },
  {
    titulo: "SADHART — Sertraline Antidepressant Heart Attack Randomized Trial",
    tipo: "estudo",
    organizacao: "JAMA",
    ano: "2002",
    descricao: "Segurança e eficácia da sertralina pós-IAM — referência para ISRS em cardiopatas.",
    url: "https://pubmed.ncbi.nlm.nih.gov/12479764/",
    categorias: ["TDM", "Cardiopatia", "Sertralina"],
  },
  {
    titulo: "BALANCE — Lithium vs Valproate in Bipolar Disorder",
    tipo: "estudo",
    organizacao: "Lancet",
    ano: "2010",
    descricao: "Superioridade do lítio vs valproato para manutenção do TAB — confirma o lítio como padrão de manutenção.",
    url: "https://pubmed.ncbi.nlm.nih.gov/19923131/",
    categorias: ["TAB", "Lítio", "Valproato"],
  },
  {
    titulo: "Cipriani et al. — Comparative Efficacy of Antidepressants",
    tipo: "estudo",
    organizacao: "Lancet",
    ano: "2018",
    descricao: "Metanálise em rede de 522 ensaios comparando 21 antidepressivos — maior comparação sistemática já realizada.",
    url: "https://pubmed.ncbi.nlm.nih.gov/29477251/",
    categorias: ["TDM", "ISRS", "Comparativo"],
  },

  // Bases de dados
  {
    titulo: "PubMed / MEDLINE",
    tipo: "base",
    organizacao: "NIH / NLM",
    descricao: "Base de dados primária de literatura médica — busca por fármaco, transtorno ou interação.",
    url: "https://pubmed.ncbi.nlm.nih.gov",
    categorias: ["Literatura", "Evidência"],
  },
  {
    titulo: "LactMed",
    tipo: "base",
    organizacao: "NIH / NLM",
    descricao: "Base de dados de fármacos na lactação — referência para segurança em amamentação, atualizada continuamente.",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK501922/",
    categorias: ["Lactação", "Gestação"],
  },
  {
    titulo: "Drugs@FDA",
    tipo: "base",
    organizacao: "US Food & Drug Administration",
    descricao: "Bulas aprovadas pela FDA, relatórios de revisão e informações de aprovação — fonte primária de indicações aprovadas.",
    url: "https://www.accessdata.fda.gov/scripts/cder/daf/",
    categorias: ["Bulas", "Indicações", "Regulatório"],
  },
  {
    titulo: "CredibleMeds / AZCERT QTc Database",
    tipo: "base",
    organizacao: "AZCERT / Arizona CERT",
    descricao: "Base de risco de QTc por fármaco — essencial antes de prescrever em cardiopatas ou combinar múltiplos fármacos.",
    url: "https://www.crediblemeds.org",
    categorias: ["QTc", "Interações", "Segurança"],
  },
];

const tipoConfig = {
  guideline: { label: "Guideline", cls: "bg-green-500/10 text-green-700 border-green-500/20", icon: Globe },
  livro:     { label: "Livro",     cls: "bg-blue-500/10 text-blue-700 border-blue-500/20",  icon: BookOpen },
  estudo:    { label: "Estudo",    cls: "bg-violet-500/10 text-violet-700 border-violet-500/20", icon: FileText },
  base:      { label: "Base",      cls: "bg-amber-500/10 text-amber-700 border-amber-500/20", icon: BookMarked },
};

const grupos = [
  { id: "guideline", label: "Guidelines Internacionais" },
  { id: "livro",     label: "Livros de Referência" },
  { id: "estudo",    label: "Estudos-chave" },
  { id: "base",      label: "Bases de Dados Online" },
] as const;

export default function CientificaPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link
              href="/psicofarmacologia/biblioteca"
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors shrink-0"
            >
              <ChevronLeft size={16} />
            </Link>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #64748B, #475569)" }}
            >
              <BookMarked size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Biblioteca Científica</h1>
              <p className="text-xs text-muted-foreground">
                {referencias.length} referências · guidelines, livros, estudos-chave e bases de dados
              </p>
            </div>
          </div>

          {/* Grupos */}
          {grupos.map(({ id, label }) => {
            const refs = referencias.filter((r) => r.tipo === id);
            const { icon: Icon, cls } = tipoConfig[id];

            return (
              <div key={id} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Icon size={14} className="text-muted-foreground" />
                  <h2 className="text-sm font-bold text-foreground">{label}</h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                    {refs.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {refs.map((ref) => (
                    <div
                      key={ref.titulo}
                      className="bg-card border border-border rounded-2xl p-4 space-y-2"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <p className="font-bold text-foreground text-sm">{ref.titulo}</p>
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${cls}`}>
                              {tipoConfig[ref.tipo].label}
                            </span>
                            {ref.ano && (
                              <span className="text-[10px] text-muted-foreground">{ref.ano}</span>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground font-medium mb-1">{ref.organizacao}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{ref.descricao}</p>
                        </div>
                        {ref.url && (
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors shrink-0"
                          >
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {ref.categorias.map((cat) => (
                          <span
                            key={cat}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
