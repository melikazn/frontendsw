interface PasswordRequirementsProps {
  minLengthOk: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
}

const PasswordRequirements = ({
  minLengthOk,
  hasUppercase,
  hasLowercase,
  hasNumber,
}: PasswordRequirementsProps) => {
  return (
    <ul className="text-sm text-[#00296b] space-y-1 text-left pl-2">
      <li>{minLengthOk ? "✅" : "❌"} Minst 6 tecken</li>
      <li>{hasUppercase ? "✅" : "❌"} Minst en stor bokstav (A–Z)</li>
      <li>{hasLowercase ? "✅" : "❌"} Minst en liten bokstav (a–z)</li>
      <li>{hasNumber ? "✅" : "❌"} Minst en siffra (0–9)</li>
    </ul>
  );
};

export default PasswordRequirements;
