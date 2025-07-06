'use client';

import { Prisma } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
type AuthorCardProp = {
  author: Prisma.UserGetPayload<{
    select: {
      id: true;
      name: true;
      email: true;
      image: true;
      role: true;
      articles: {
        select: {
          id: true;
        };
      };
    };
  }>;
};

const AuthorCard = ({ author }: AuthorCardProp) => {
  return (
    <div className="space-y-2 p-2">
      <div className="flex items-center justify-between">
        <Avatar className="hover:cursor-pointer">
          <AvatarImage src={author.image || undefined} alt={'profile'} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Badge variant={'secondary'}>{author.articles.length} article</Badge>
      </div>
      <Separator />
      <div>
        <h1 className="text-lg">{author.name}</h1>
        <p className="text-sm text-muted-foreground">{author.email}</p>
        <Badge className="capitalize" variant={'secondary'}>
          {author.role.toLocaleLowerCase()}
        </Badge>
      </div>
      <Separator />
      <div className="flex items-center justify-end gap-2">
        <Button size={'sm'}>Message</Button>
        <Button size={'sm'}>View Details</Button>
      </div>
    </div>
  );
};

export default AuthorCard;
