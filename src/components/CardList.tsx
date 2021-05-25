/* eslint-disable import/no-extraneous-dependencies */
import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');

  const { isOpen, onOpen, onClose } = useDisclosure();

  function hanleOpenModal(): void {
    onOpen();
  }

  function handleViewImage(url: string): void {
    setImageUrl(url);
    hanleOpenModal();
  }

  return (
    <>
      <SimpleGrid columns={3} spacing={8}>
        {cards.map(card => (
          <Card key={card.id} data={card} viewImage={handleViewImage} />
        ))}
      </SimpleGrid>

      <ModalViewImage imgUrl={imageUrl} isOpen={isOpen} onClose={onClose} />
    </>
  );
}
