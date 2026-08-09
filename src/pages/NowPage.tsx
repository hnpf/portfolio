// @ts-nocheck
import React, { memo, useEffect, useRef, useState, useCallback } from "react";
import { Card } from "../components/Card";
import WavyProgress from "../components/WavyProgress";
import { materialIcon } from "../components/MaterialIcon";
import { BounceButton } from "../components/TechStack";

const BuildIcon = materialIcon("terminal");
const LearnIcon = materialIcon("school");
const ListenIcon = materialIcon("headphones");
const MusicIcon = materialIcon("music_note");
const ListIcon = materialIcon("chevron_right");
const RefreshIcon = materialIcon("refresh");
const ScheduleIcon = materialIcon("schedule");
const RadioIcon = materialIcon("radio");

interface TrackData {
  artist: string;
  name: string;
  album: string;
  url: string;
  image?: string;
  isNowPlaying: boolean;
  timestamp?: number | null;
  durationMs?: number | null;
  fetchedAt: number;
  prevScrobbleAt?: number | null;
}

const formatTime = (ms: number = 0) => {
  if (!ms || isNaN(ms) || ms < 0) return "0:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const getRelativeTime = (timestampMs?: number | null) => {
  if (!timestampMs) return "Recently";
  const diffMs = Date.now() - timestampMs;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}d ago`;
};

const buildTrackKey = (track?: Partial<TrackData> | null) => {
  if (!track) return "";
  return `${(track.artist || "").trim().toLowerCase()}:::${(track.name || "").trim().toLowerCase()}`;
};

export const NowPage = memo(() => {
  return (
    <div className="max-w-6xl mx-auto space-y-12 md:space-y-16 pb-24">
      <header className="page-header flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
        <div className="space-y-4">
          <h2 className="page-title !text-6xl md:!text-9xl font-expressive-bold italic">Now</h2>
          <p className="text-xl md:text-2xl font-display font-medium text-[var(--on-surface-variant)] opacity-60 max-w-2xl leading-tight">
            What I'm currently building, learning, and listening to right now.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-0">
        {/* SECTION 1: BUILDING */}
        <Card
          delay={0.1}
          innerClassName="p-8 md:p-12 border-6 border-[var(--outline-variant)]/90 transition-colors flex flex-col justify-between min-h-[400px] md:min-h-[450px] group/now"
        >
          <div className="space-y-10">
            <div className="space-y-6">
              <h3 className="flex items-center gap-4 text-4xl md:text-5xl font-display font-black tracking-tighter italic group-hover/now:translate-x-1 transition-transform duration-300">
                <BuildIcon size={42} fill className="text-[var(--primary)] shrink-0" />
                Now Building
              </h3>
            </div>
            <div className="space-y-6 border-t-3 border-[var(--outline-variant)]/90 pt-10">
              <ul className="space-y-4">
                <li className="flex gap-3 text-[17px] opacity-80 leading-relaxed group/tip">
                  <ListIcon size={18} fill className="text-[var(--primary)] mt-1 shrink-0 group-hover/tip:translate-x-1 transition-transform duration-200" />
                  Helping the community and becoming more open to PR's and contributions
                </li>
                <li className="flex gap-3 text-[17px] opacity-80 leading-relaxed group/tip">
                  <ListIcon size={18} fill className="text-[var(--primary)] mt-1 shrink-0 group-hover/tip:translate-x-1 transition-transform duration-200" />
                  Tinkering with personal base workflows and tools/scripts.
                </li>
                <li className="flex gap-3 text-[17px] opacity-80 leading-relaxed group/tip">
                  <ListIcon size={18} fill className="text-[var(--primary)] mt-1 shrink-0 group-hover/tip:translate-x-1 transition-transform duration-200" />
                  Frequently updating and reworking virex.lol for the best user experience i can possibly make
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* SECTION 2: LEARNING */}
        <Card
          delay={0.2}
          innerClassName="p-8 md:p-12 border-6 border-[var(--outline-variant)]/90 transition-colors flex flex-col justify-between min-h-[400px] md:min-h-[450px] group/now"
        >
          <div className="space-y-10">
            <div className="space-y-6">
              <h3 className="flex items-center gap-4 text-4xl md:text-5xl font-display font-black tracking-tighter italic group-hover/now:translate-x-1 transition-transform duration-300">
                <LearnIcon size={42} fill className="text-[var(--primary)] shrink-0" />
                Now Learning
              </h3>
            </div>
            <div className="space-y-6 border-t-3 border-[var(--outline-variant)]/90 pt-10">
              <ul className="space-y-4">
                <li className="flex gap-3 text-[17px] opacity-80 leading-relaxed group/tip">
                  <ListIcon size={18} fill className="text-[var(--primary)] mt-1 shrink-0 group-hover/tip:translate-x-1 transition-transform duration-200" />
                  Sound design & synthesis: wave architectures, fm synthesis basics, etc.
                </li>
                <li className="flex gap-3 text-[17px] opacity-80 leading-relaxed group/tip">
                  <ListIcon size={18} fill className="text-[var(--primary)] mt-1 shrink-0 group-hover/tip:translate-x-1 transition-transform duration-200" />
                  Hardware interfaces: managing low latency audio pipelines
                </li>
                <li className="flex gap-3 text-[17px] opacity-80 leading-relaxed group/tip">
                  <ListIcon size={18} fill className="text-[var(--primary)] mt-1 shrink-0 group-hover/tip:translate-x-1 transition-transform duration-200" />
                  Hyprland plug-ins: experimenting with plugins like "Infinite canvas" and Gloview in my primary configs along with quickshell.
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* SECTION 3: LISTENING */}
        <Card
          delay={0.4}
          className="md:col-span-2"
          innerClassName="bg-[var(--primary)] text-[var(--on-primary)] p-8 md:p-12 border-6 border-[var(--outline-variant)]/40 transition-colors flex flex-col justify-between min-h-[400px] md:min-h-[450px] group/now"
        >
          <LastFmNowPlayingCard />
        </Card>
      </div>
    </div>
  );
});

const SESSION_KEY = "virex-now-playing-session-v4";

const isSameTrack = (a: TrackData | null, b: TrackData | null) => {
  if (!a || !b) return false;
  return (
    a.artist === b.artist &&
    a.name === b.name &&
    a.album === b.album &&
    a.image === b.image &&
    a.isNowPlaying === b.isNowPlaying &&
    a.durationMs === b.durationMs &&
    a.timestamp === b.timestamp
  );
};

const LastFmNowPlayingCard = () => {
  const [track, setTrack] = useState<TrackData | null>(null);
  const trackRef = useRef<TrackData | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [imageError, setImageError] = useState(false);

  // Restore active session synchronously on component creation
  const sessionRef = useRef<{ trackKey: string; startedAt: number } | null>(null);

  if (sessionRef.current === null && typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.trackKey && typeof parsed?.startedAt === "number") {
          sessionRef.current = parsed;
        }
      }
    } catch {}
  }

  const updateSessionStart = (newStartedAt: number, key: string) => {
    sessionRef.current = { trackKey: key, startedAt: newStartedAt };
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionRef.current));
    } catch {}
    setNow(Date.now());
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!track?.isNowPlaying || !track.durationMs) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.min(1, Math.max(0, clickX / rect.width));
    const targetElapsed = ratio * track.durationMs;
    const newStart = Date.now() - targetElapsed;
    const key = buildTrackKey(track);
    updateSessionStart(newStart, key);
  };

  const setTrackState = useCallback((newTrack: TrackData | null) => {
    if (!isSameTrack(trackRef.current, newTrack)) {
      trackRef.current = newTrack;
      setTrack(newTrack);
      setImageError(false);
    }
  }, []);

  const fetchDirectFromLastFm = async (): Promise<TrackData> => {
    const apiKey = (import.meta as any).env?.VITE_LASTFM_API_KEY || (import.meta as any).env?.LASTFM_API_KEY || "";
    const username = (import.meta as any).env?.VITE_LASTFM_USERNAME || (import.meta as any).env?.LASTFM_USERNAME || "";

    if (!apiKey || !username) {
      throw new Error("Last.fm client credentials not configured.");
    }

    const url = new URL("https://ws.audioscrobbler.com/2.0/");
    url.searchParams.set("method", "user.getrecenttracks");
    url.searchParams.set("user", username);
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1");

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Last.fm API HTTP ${res.status}`);
    const text = await res.text();
    const json = text ? JSON.parse(text) : null;

    const tracks = Array.isArray(json?.recenttracks?.track)
      ? json.recenttracks.track
      : json?.recenttracks?.track
      ? [json.recenttracks.track]
      : [];

    const trackItem = tracks.find((item: any) => item?.["@attr"]?.nowplaying === "true") || tracks[0];
    if (!trackItem) throw new Error("No recent tracks found.");

    const fetchedAt = Date.now();
    const nowPlaying = trackItem?.["@attr"]?.nowplaying === "true";
    const artist = typeof trackItem?.artist === "object"
      ? trackItem.artist?.["#text"] || "Unknown Artist"
      : trackItem?.artist || "Unknown Artist";
    const name = typeof trackItem?.name === "string" ? trackItem.name : "Unknown Track";
    const album = typeof trackItem?.album === "object"
      ? trackItem.album?.["#text"] || ""
      : trackItem?.album || "";
    const trackUrl = typeof trackItem?.url === "string" ? trackItem.url : "";

    let image: string | undefined = undefined;
    if (Array.isArray(trackItem?.image)) {
      const reversed = trackItem.image.slice().reverse();
      const validImg = reversed.find((item: any) => item?.["#text"] && item["#text"].trim().length > 0);
      if (validImg && !validImg["#text"].includes("2a96cbd8b46e442fc41c2b86b821562f")) {
        image = validImg["#text"];
      }
    }

    const timestamp = trackItem?.date?.uts ? Number(trackItem.date.uts) * 1000 : null;

    let durationMs: number | null = null;
    try {
      const infoUrl = new URL("https://ws.audioscrobbler.com/2.0/");
      infoUrl.searchParams.set("method", "track.getInfo");
      infoUrl.searchParams.set("api_key", apiKey);
      infoUrl.searchParams.set("format", "json");

      if (trackItem?.mbid) {
        infoUrl.searchParams.set("mbid", trackItem.mbid);
      } else {
        infoUrl.searchParams.set("artist", artist);
        infoUrl.searchParams.set("track", name);
        infoUrl.searchParams.set("autocorrect", "1");
      }

      const infoRes = await fetch(infoUrl.toString());
      if (infoRes.ok) {
        const infoText = await infoRes.text();
        const infoJson = infoText ? JSON.parse(infoText) : null;
        const rawDur = Number(infoJson?.track?.duration);
        if (!isNaN(rawDur) && rawDur > 0) {
          durationMs = rawDur;
        }
      }
    } catch {}

    return {
      artist,
      name,
      album,
      url: trackUrl,
      image,
      isNowPlaying: nowPlaying,
      timestamp,
      durationMs,
      fetchedAt,
    };
  };

  const fetchTrack = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    let fetchedTrack: TrackData | null = null;

    try {
      const res = await fetch("/api/lastfm/now-playing");
      if (res.ok) {
        const text = await res.text();
        if (text) {
          const data = JSON.parse(text);
          if (data?.track) {
            fetchedTrack = data.track;
          }
        }
      }
    } catch {}

    if (!fetchedTrack) {
      try {
        fetchedTrack = await fetchDirectFromLastFm();
      } catch (directErr: any) {
        if (!trackRef.current) {
          setStatus("error");
          setErrorMsg(directErr?.message || "Failed to fetch music playback.");
        }
        if (isManual) setTimeout(() => setIsRefreshing(false), 500);
        return;
      }
    }

    const key = buildTrackKey(fetchedTrack);

    if (fetchedTrack.isNowPlaying) {
      if (sessionRef.current && sessionRef.current.trackKey === key) {
        // Keep active track start timestamp untouched
      } else {
        updateSessionStart(Date.now(), key);
      }
    } else {
      sessionRef.current = null;
      try {
        localStorage.removeItem(SESSION_KEY);
      } catch {}
    }

    setTrackState(fetchedTrack);
    setStatus("ready");
    setErrorMsg("");

    if (isManual) {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  }, [setTrackState]);

  useEffect(() => {
    let active = true;
    const poll = async () => {
      if (active) await fetchTrack();
    };

    poll();
    const timer = setInterval(poll, 3000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [fetchTrack]);

  // Live timer tick every 100ms when track is actively playing
  useEffect(() => {
    if (!track?.isNowPlaying) return;

    const timer = setInterval(() => {
      setNow(Date.now());
    }, 100);

    return () => clearInterval(timer);
  }, [track?.isNowPlaying]);

  const isLoading = status === "loading";
  const isError = status === "error";

  const trackKey = buildTrackKey(track);
  const startedAt = (sessionRef.current && sessionRef.current.trackKey === trackKey)
    ? sessionRef.current.startedAt
    : (track?.fetchedAt || now);

  const isNowPlayingRaw = track?.isNowPlaying ?? false;
  const durationMs = track?.durationMs && track.durationMs > 0 ? track.durationMs : null;

  let elapsedMs = 0;
  let percent = 0;
  let isPaused = false;

  if (isNowPlayingRaw) {
    const rawElapsed = Math.max(0, now - startedAt);
    if (durationMs) {
      if (rawElapsed >= durationMs + 10000) {
        // Track finished playing or user paused playback
        isPaused = true;
        elapsedMs = durationMs;
        percent = 100;
      } else if (rawElapsed >= durationMs) {
        elapsedMs = durationMs;
        percent = 100;
      } else {
        elapsedMs = rawElapsed;
        percent = Math.min(100, Math.max(0, (elapsedMs / durationMs) * 100));
      }
    } else {
      elapsedMs = rawElapsed;
      percent = 100;
    }
  } else {
    percent = 100;
    elapsedMs = durationMs || 0;
  }

  const isCurrentlyPlaying = isNowPlayingRaw && !isPaused;

  return (
    <div className="space-y-8">
      {/* Header line with Refresh action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="flex items-center gap-4 text-4xl md:text-5xl font-display font-black tracking-tighter italic group-hover/now:translate-x-1 transition-transform duration-300">
          <ListenIcon size={42} fill className="text-[var(--on-primary)] shrink-0" />
          Now Listening
        </h3>

        <BounceButton
          onClick={() => fetchTrack(true)}
          disabled={isRefreshing || isLoading}
          loading={isRefreshing}
          title="Refresh Last.fm status"
          icon={RefreshIcon}
          iconClassName={isRefreshing ? "animate-spin" : ""}
          label={<span className="hidden sm:inline">Force sync</span>}
          className="inline-flex items-center gap-2 rounded-full border-4 border-[var(--on-primary)]/30 bg-[rgba(255,255,255,0.12)] px-5 py-2 text-sm font-bold tracking-wider text-[var(--on-primary)] hover:bg-[rgba(255,255,255,0.22)]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.9fr] items-stretch gap-8 md:gap-10 border-t-3 border-[var(--on-primary)]/20 pt-8">
        <div className="flex h-full flex-col justify-between space-y-6">
          {isLoading && (
            <div className="flex h-full flex-col justify-center items-center py-16 space-y-4 text-center">
              <RadioIcon size={48} fill className="animate-bounce opacity-80" />
              <p className="text-lg font-medium opacity-90">Connecting to Last.fm stream…</p>
            </div>
          )}

          {isError && (
            <div className="flex h-full flex-col justify-center py-12 space-y-6">
              <p className="text-lg font-semibold text-[var(--on-primary)] opacity-90">
                {errorMsg || "Unable to retrieve playback status."}
              </p>
              <BounceButton
                onClick={() => fetchTrack(true)}
                icon={RefreshIcon}
                label="Retry Connection"
                className="self-start inline-flex items-center gap-2 rounded-2xl border-4 border-[var(--on-primary)]/30 bg-white/20 px-6 py-3 text-sm font-bold text-[var(--on-primary)] hover:bg-white/30"
              />
            </div>
          )}

          {!isLoading && !isError && track && (
            <div className="flex h-full flex-col justify-between space-y-6">
              <div className="space-y-6">
                {/* Status badge */}
                <div className="flex items-center justify-between gap-3">
                  {isCurrentlyPlaying ? (
                    <div className="inline-flex gap-2.5 rounded-full border-3 border-[var(--on-primary)]/20 bg-[var(--on-primary)]/10 px-4 py-1.5 text-md font-extrabold tracking-widest text-[var(--on-primary)]/80">
                      <span className="relative flex h-2.5 w-2.5 py-0.5">
                        <ScheduleIcon size={14} fill className="shrink-0 opacity-75" />
                      </span>
                      <span>Now playing</span>
                    </div>
                  ) : isPaused ? (
                    <div className="inline-flex items-center gap-2 rounded-full border-3 border-[var(--on-primary)]/20 bg-[var(--on-primary)]/10 px-4 py-1.5 text-md font-bold tracking-widest text-[var(--on-primary)]/80">
                      <ScheduleIcon size={14} fill className="shrink-0 opacity-75" />
                      <span>Playback Paused</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 rounded-full border-3 border-[var(--on-primary)]/20 bg-[var(--on-primary)]/10 px-4 py-1.5 text-md font-bold tracking-widest text-[var(--on-primary)]/80">
                      <ScheduleIcon size={14} fill className="shrink-0" />
                      <span>Last Scrobbled - {getRelativeTime(track.timestamp)}</span>
                    </div>
                  )}
                </div>

                {/* Track Details */}
                <div className="space-y-2">
                  <h4 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-tight text-[var(--on-primary)] drop-shadow-sm">
                    {track.name}
                  </h4>
                  <p className="text-lg md:text-xl font-medium opacity-90 text-[var(--on-primary)] leading-relaxed">
                    <span className="font-bold">{track.artist}</span>
                    {track.album ? (
                      <span className="opacity-75"> on {track.album}</span>
                    ) : null}
                  </p>
                </div>
              </div>

              {/* Progress & Actions */}
              <div className="mt-6 space-y-6">
                <div className="space-y-3">
                  <div
                    onClick={handleProgressBarClick}
                    className="cursor-pointer overflow-hidden rounded-[1.75rem] border-4 border-[var(--on-primary)]/30 bg-[var(--on-primary)]/10 p-3 shadow-inner hover:border-[var(--on-primary)]/50 transition-colors group/seek"
                    title={isCurrentlyPlaying ? "Click anywhere to sync / seek track progress" : undefined}
                  >
                    <WavyProgress percent={percent} className="h-8 pointer-events-none" />
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono font-bold tracking-wider text-[var(--on-primary)] opacity-85 px-1">
                    <div className="flex items-center gap-2">
                      <span>{formatTime(elapsedMs)}</span>
                    </div>
                    <span>
                      {durationMs
                        ? isCurrentlyPlaying
                          ? `-${formatTime(Math.max(0, durationMs - elapsedMs))}`
                          : formatTime(durationMs)
                        : ""}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  {track.url && (
                    <BounceButton
                      url={track.url}
                      icon={MusicIcon}
                      label="View on Last.fm"
                      className="inline-flex items-center gap-2 rounded-full border-4 border-[var(--on-primary)]/30 bg-[rgba(255,255,255,0.14)] px-6 py-3 text-sm font-bold text-[var(--on-primary)] hover:bg-[rgba(255,255,255,0.25)] hover:border-[var(--on-primary)]/60"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cover Art / Visualizer Section */}
        {track && (
          <div className="relative overflow-hidden rounded-[3rem] border-6 border-[var(--on-primary)]/20 bg-[var(--on-primary)]/10 shadow-xl group/cover min-h-[320px] flex items-center justify-center">
            {track.image && !imageError ? (
              <>
                <img
                  src={track.image}
                  alt={`${track.name} album cover`}
                  onError={() => setImageError(true)}
                  className="h-full w-full object-cover min-h-[320px] max-h-[440px] transition-transform duration-700 group-hover/cover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-8 flex flex-col justify-end">
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-white/70">{track.artist}</p>
                  <h4 className="mt-1 text-2xl font-display font-black tracking-tight text-white drop-shadow-md">{track.name}</h4>
                  {track.album && <p className="mt-1 text-sm text-white/80 font-medium">{track.album}</p>}
                </div>
              </>
            ) : (
              <div className="relative flex flex-col items-center justify-center w-full h-full min-h-[340px] rounded-[2.5rem]  p-8 text-center shadow-inner overflow-hidden border-2 border-[var(--on-primary)]/10">
                {/* Vinyl record disc */}
               {/* static wrapper holds the shadow and dimensions */}
              <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
                {/* spinning element stays inside */}
                <div
                  className={`w-full h-full rounded-full bg-neutral-950 border-4 border-neutral-800/80 flex items-center justify-center transition-transform duration-1000 ${
                    isCurrentlyPlaying ? "animate-[spin_10s_linear_infinite]" : ""
                  }`}
                >
                  {/* Sheen gradient reflection */}
                  <div className="absolute inset-0 rounded-full pointer-events-none" />
                  
                  {/* Concentric record grooves */}
                  <div className="absolute inset-3 rounded-full border border-white/10" />
                  <div className="absolute inset-6 rounded-full border border-white/5" />
                  <div className="absolute inset-9 rounded-full border border-white/10" />
                  <div className="absolute inset-12 rounded-full border border-white/5" />
                  <div className="absolute inset-15 rounded-full border border-white/10" />
                  <div className="absolute inset-18 rounded-full border border-white/5" />

                  {/* Vinyl center sticker */}
                  <div className="relative w-20 h-20 rounded-full bg-[var(--primary)]/60 border-4 border-neutral-950 flex flex-col items-center justify-center shadow-md">
                    <MusicIcon size={24} fill className="text-[var(--on-primary-container)] opacity-90" />
                    {/* Spindle hole */}
                    <div className="w-3.5 h-3.5 rounded-full bg-neutral-950 border border-white/30 shadow-inner mt-1" />
                  </div>
                </div>
              </div>

                <div className="mt-6 space-y-1">
                  <h4 className="text-xl font-display font-black tracking-tight text-[var(--on-primary)] drop-shadow-sm">{track.name}</h4>
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--on-primary)] opacity-75">{track.artist}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
