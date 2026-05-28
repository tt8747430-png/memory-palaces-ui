import subjectSpriteSheet from "figma:asset/fccbea6a0529fd90cfb6d9ef26888f8a3e4724ca.png";

export default function ScienceSubjectIcon() {
  return (
    <div className="relative size-full">
      <div
        className="absolute bg-[93.75%_8.08%] bg-no-repeat bg-size-[206.34%_207.25%] h-[80.001px] left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-20"
        style={{
          backgroundImage: `url('${subjectSpriteSheet}')`,
        }}
      />
    </div>
  );
}