import { MapPin, Pencil, Droplets, Calendar, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function ProfileCard() {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-[0_4px_20px_rgba(74,108,247,0.08)] border border-border">
      {/* Edit button */}
      <div className="flex justify-end mb-2">
        <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-muted text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
          <Pencil size={14} />
        </button>
      </div>

      {/* Avatar + info */}
      <div className="flex flex-col items-center text-center mb-4">
        <Avatar className="h-16 w-16 mb-3 ring-2 ring-primary/20">
          <AvatarImage src="/avatar-placeholder.jpg" alt="Dr. André Kirchner" />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
            AK
          </AvatarFallback>
        </Avatar>
        <h3 className="font-bold text-foreground text-sm">Dr. André Kirchner</h3>
        <Badge variant="secondary" className="mt-1 text-[10px] tracking-widest font-semibold uppercase">
          Psiquiatra
        </Badge>
        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
          <MapPin size={11} />
          <span>São Paulo, SP</span>
        </div>
      </div>

      <div className="h-px bg-border mb-4" />

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Calendar, label: "Nascimento", value: "14/03/1997" },
          { icon: Droplets, label: "Tipo sang.", value: "O+" },
          { icon: Clock,    label: "Carga horária", value: "60h/sem" },
          { icon: MapPin,   label: "CRM-SP", value: "123.456" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-muted/50 rounded-xl p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Icon size={11} className="text-primary shrink-0" />
              <span className="text-[10px] text-muted-foreground">{label}</span>
            </div>
            <p className="text-xs font-semibold text-foreground font-mono">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
