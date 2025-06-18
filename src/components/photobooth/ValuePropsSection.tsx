
import React from 'react';
import { Heart, Users, PartyPopper } from 'lucide-react';

const valueProps = [
  {
    icon: Users,
    title: "Build Community",
    description: "Create a living gallery of your patrons, turning customers into community members.",
  },
  {
    icon: Heart,
    title: "Boost Engagement",
    description: "Generate authentic, user-generated content that drives social media interaction.",
  },
  {
    icon: PartyPopper,
    title: "Create Lasting Memories",
    description: "Give your guests a fun, interactive way to remember their great times at Champions.",
  },
];

const ValuePropsSection: React.FC = () => {
  return (
    <div className="mt-24 text-center">
      <h2 className="text-4xl font-serif font-semibold">More Than Just Photos</h2>
      <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
        This isn't just a feature; it's a tool to build a stronger, more engaged community.
      </p>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {valueProps.map((prop) => (
          <div key={prop.title} className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10 text-primary">
              <prop.icon className="w-8 h-8"/>
            </div>
            <h3 className="text-xl font-serif font-semibold mb-2">{prop.title}</h3>
            <p className="text-muted-foreground">{prop.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValuePropsSection;
