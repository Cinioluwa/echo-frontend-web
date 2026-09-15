import { DEV_ACCOUNTS } from "./devAccounts";

type DevAccount = (typeof DEV_ACCOUNTS)[number];

interface DevLoginProps {
  disabled?: boolean;
  onSelect: (credentials: DevAccount) => Promise<void>;
}

const DevLogin = ({ disabled = false, onSelect }: DevLoginProps) => {
  return (
    <div className="w-full border-t border-[#e0e0e0] pt-4" aria-label="Developer preview">
      <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9a9a9a]">
        Developer preview
      </p>
      <div className="grid grid-cols-2 gap-2">
        {DEV_ACCOUNTS.map((account) => (
          <button
            key={account.key}
            type="button"
            disabled={disabled}
            onClick={() => void onSelect(account)}
            className="rounded-full border border-[#f49b31] px-3 py-2 text-xs font-semibold text-[#d9821f] transition-colors hover:bg-[#fff3e2] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue as {account.label}
          </button>
        ))}
        </div>
    </div>
  );
};

export default DevLogin;