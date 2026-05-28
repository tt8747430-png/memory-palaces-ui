import progressIllustration from "figma:asset/a89a6ef3f88fd2857fdad1d76f0f4ad72a96dff2.png";

export default function ProgressIllustration() {
  return (
    <div className="relative size-full">
      <div
        className="absolute bg-center bg-cover bg-no-repeat inset-0"
        style={{
          backgroundImage: `url('${progressIllustration}')`,
        }}
      />
    </div>
  );
}