'use client';

const HeroSection = () => {
  return (
    <div className="grid gap-4 md:grid-cols-4 md:grid-rows-2">
      {Array.from({ length: 5 }, (_, i) => (
        <SectionCard
          key={i}
          classes={i === 0 ? 'md:row-span-2 md:col-span-2' : ''}
        />
      ))}
    </div>
  );
};

export default HeroSection;

interface SectionCardProps {
  classes?: string;
}

const SectionCard = ({ classes }: SectionCardProps) => {
  return (
    <div className={`${classes} bg-red-100/20 rounded-sm relative`}>
      <div id="artcile-image" className="min-h-44"></div>
      <div className="bg-black/10 p-2 absolute bottom-0 w-full">
        <h1>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h1>
      </div>
    </div>
  );
};
