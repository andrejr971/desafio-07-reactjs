/* eslint-disable no-nested-ternary */
// eslint-disable-next-line import/no-extraneous-dependencies
import { useMemo } from 'react';
import { Button, Box } from '@chakra-ui/react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

type IData = {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
};

export default function Home(): JSX.Element {
  const loadData = async ({ pageParam = null }): Promise<any> => {
    const response = await api.get(`/api/images`, {
      params: {
        after: pageParam,
      },
    });

    return response.data;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', loadData, {
    getNextPageParam: (lastPage, pages) => {
      return lastPage.after;
    },
  });

  const formattedData = useMemo(() => {
    let array = [];

    if (data) {
      data.pages.forEach(page => {
        const newArray = page.data.map((d: IData) => ({
          title: d.title,
          description: d.description,
          url: d.url,
          ts: d.ts,
          id: d.id,
        }));

        array = [...array, ...newArray];
      });
    }

    return array;
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />

        {hasNextPage && (
          <Button
            colorScheme="orange"
            mt={8}
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            type="button"
          >
            {isFetchingNextPage
              ? 'Carregando...'
              : hasNextPage
              ? 'Carregar mais'
              : 'Nothing more to load'}
          </Button>
        )}
      </Box>
    </>
  );
}
