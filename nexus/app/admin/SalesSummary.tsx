import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket } from "lucide-react";

export function SalesSummary({ count }: { count: number }) {
  return (
    <Card className="max-w-xs">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Ticket className="h-4 w-4 text-cyan-400" />
          Ventas totales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-cyan-400">{count}</p>
        <p className="text-sm text-zinc-500">boletos vendidos</p>
      </CardContent>
    </Card>
  );
}
