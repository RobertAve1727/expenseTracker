import React, { useEffect, useState, useCallback } from "react";
import {
  Bell,
  Trash2,
  ShieldAlert,
  ArrowUpRight,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Inbox,
} from "lucide-react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../services/useAuth";

interface AlertItem {
  id: string;
  type: "warning" | "success" | "info" | "critical";
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

const Alerts = () => {
  const { user } = useAuth();
  const [dbAlerts, setDbAlerts] = useState<AlertItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchAlertData = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDbAlerts(data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    fetchAlertData();

    // REALTIME SUBSCRIPTION
    // This listens for any changes the DB Trigger makes and updates your UI instantly
    const channel = supabase
      .channel("realtime-alerts")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "alerts",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setDbAlerts((prev) => [payload.new as AlertItem, ...prev]);
          } else if (payload.eventType === "DELETE") {
            setDbAlerts((prev) => prev.filter((a) => a.id !== payload.old.id));
          } else if (payload.eventType === "UPDATE") {
            setDbAlerts((prev) =>
              prev.map((a) =>
                a.id === payload.new.id ? (payload.new as AlertItem) : a,
              ),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchAlertData]);

  const markAsRead = async (id: string) => {
    // Optimistic Update: Change UI immediately
    setDbAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_read: true } : a)),
    );

    try {
      const { error } = await supabase
        .from("alerts")
        .update({ is_read: true })
        .eq("id", id);
      if (error) throw error;
    } catch (err) {
      console.error("Update Error:", err);
      fetchAlertData(); // Rollback on error
    }
  };

  const markAllRead = async () => {
    if (!user?.id) return;
    setIsProcessing(true);

    // Optimistic Update
    setDbAlerts((prev) => prev.map((a) => ({ ...a, is_read: true })));

    try {
      const { error } = await supabase
        .from("alerts")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);
      if (error) throw error;
    } catch (err) {
      console.error("Bulk Update Error:", err);
      fetchAlertData();
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteAlert = async (id: string) => {
    // Optimistic Update
    setDbAlerts((prev) => prev.filter((a) => a.id !== id));

    try {
      const { error } = await supabase.from("alerts").delete().eq("id", id);
      if (error) throw error;
    } catch (err) {
      console.error("Delete Error:", err);
      fetchAlertData();
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <ShieldAlert size={20} className="text-rose-500" />;
      case "warning":
        return <AlertTriangle size={20} className="text-amber-500" />;
      case "success":
        return <CheckCircle2 size={20} className="text-emerald-500" />;
      default:
        return <Info size={20} className="text-flow-accent" />;
    }
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-transparent py-20">
        <Loader2 className="w-10 h-10 animate-spin text-flow-accent" />
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div className="max-w-4xl mx-auto pb-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-[var(--text-h)] tracking-tighter flex items-center gap-4">
              Alerts
              {dbAlerts.some((a) => !a.is_read) && (
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>
              )}
            </h1>
            <p className="text-[var(--text)] text-xs font-black uppercase tracking-[0.2em] mt-3 opacity-60">
              Intelligence Center
            </p>
          </div>
          <button
            onClick={markAllRead}
            disabled={isProcessing || !dbAlerts.some((a) => !a.is_read)}
            className="px-6 py-2.5 bg-flow-accent/10 text-flow-accent border border-flow-accent/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-flow-accent hover:text-white transition-all disabled:opacity-20"
          >
            {isProcessing ? "Processing..." : "Mark all as read"}
          </button>
        </header>

        <div className="grid gap-4">
          {dbAlerts.length > 0 ? (
            dbAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`group relative p-6 rounded-[2rem] border transition-all duration-500 ${
                  alert.is_read
                    ? "bg-[var(--surface)] border-[var(--border)] opacity-60"
                    : "bg-[var(--surface)] border-flow-accent/30 shadow-xl"
                }`}
              >
                <div className="flex gap-6">
                  <div className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 bg-white/5">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        className={`text-sm font-black uppercase tracking-wide truncate ${
                          alert.is_read
                            ? "text-[var(--text)]"
                            : "text-[var(--text-h)]"
                        }`}
                      >
                        {alert.title}
                      </h3>
                      <span className="text-[10px] font-bold text-[var(--text)] opacity-40">
                        {new Date(alert.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text)] font-medium leading-relaxed mb-4">
                      {alert.message}
                    </p>
                    {!alert.is_read && (
                      <button
                        onClick={() => markAsRead(alert.id)}
                        className="text-[10px] font-black text-flow-accent uppercase tracking-[0.2em] flex items-center gap-2 hover:gap-3 transition-all"
                      >
                        Acknowledge <ArrowUpRight size={14} />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-rose-500/50 hover:text-rose-500 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-32 bg-[var(--surface)] rounded-[3rem] border border-[var(--border)] border-dashed">
              <Inbox size={40} className="text-[var(--text)] opacity-20 mb-6" />
              <p className="text-xs font-black text-[var(--text)] uppercase tracking-[0.3em] opacity-30">
                Everything looks clear
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;
