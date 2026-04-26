import { Placeholder } from "@/components/common/placeholder";

const TEAM = [
  { name: "[이름]", role: "[역할]", bio: "[한 줄 소개]" },
  { name: "[이름]", role: "[역할]", bio: "[한 줄 소개]" },
  { name: "[이름]", role: "[역할]", bio: "[한 줄 소개]" },
  { name: "[이름]", role: "[역할]", bio: "[한 줄 소개]" },
  { name: "[이름]", role: "[역할]", bio: "[한 줄 소개]" },
  { name: "[이름]", role: "[역할]", bio: "[한 줄 소개]" },
] as const;

export function TeamSection() {
  return (
    <section id="team" className="scroll-mt-24 py-24 sm:py-32">
      <h2 className="mb-8 text-[32px] font-medium leading-[1.4] tracking-[0.01em] text-text sm:text-[44px] sm:leading-[1.3] lg:text-[56px]">
        팀
      </h2>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TEAM.map((m, i) => (
          <li
            key={i}
            className="flex gap-4 rounded-2xl border border-border-subtle bg-bg-elev-1 p-5"
          >
            <Placeholder
              aspect="1/1"
              label={`[${m.name} 사진]`}
              className="h-16 w-16 shrink-0 text-[10px]"
            />
            <div className="min-w-0">
              <p className="text-[17px] font-medium tracking-[0.01em]">{m.name}</p>
              <p className="mt-0.5 text-sm text-text-muted">{m.role}</p>
              <p className="mt-2 text-sm text-text-muted">{m.bio}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
