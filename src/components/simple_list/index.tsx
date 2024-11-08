import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Box, Grid, Paper, styled } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import Image from 'next/image';
import { ThemeProps } from '@/types/theme';
import SimpleTypography from '@/components/typography';
import Link from 'next/link';
import { getAllModels, selectAllModels } from '@/data/get_all_models';
import MyLoader from '../skeleton/Skeleton'
import CustomCard from '../custom_card';
import Skeleton from '@mui/material/Skeleton';
import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'

type InputProps = {
  item?: object,
  route?: string,
  sliced?: number,
};
const fakeModels = [1, 2, 3, 4, 5, 6, 7, 8];
const heights = [208, 208, 208, 208, 208, 208, 208, 208, 208, 208, 208, 208, 208, 208, 208];
const Label = styled(Paper)(({ theme }: ThemeProps) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
}));

export default function SimpleList(props: InputProps) {
  const dispatch = useDispatch<any>();

  // const all__brands = useSelector(selectAllModels)
  // const all__models__status = useSelector((state: any) => state?.get_all_models?.status)


  React.useEffect(() => {
    dispatch(getAllModels({
      brand: undefined,
      categories: undefined,
      colors: undefined,
      styles: undefined,
      page: 1,
    }))
  }, [])

  if (/*all__models__status === "failed"*/ false) {
    return (
      <SimpleTypography text='Извините, ошибка сетевого подключения:('></SimpleTypography>
    )
  }
  if (/*all__models__status === "loading"*/ false) {
    return (
      <>
        <Grid container spacing={2} >
          {fakeModels?.map((model: any, index: any) => (
            <Grid item xs={3} key={index}>
              <a style={{ margin: '0 0 15px 0' }}>
                <Box sx={{ border: "1px solid #e0e0e0", height: "282px", background: "#fff", padding: "12px 12px 0 12px", position: 'relative' }}>
                  {/* <SimpleTypography text='16%' className='card__sale' /> */}
                  <Image
                    src={"/img/card-loader.jpg"}
                    // srcSet={`${process.env.NEXT_PUBLIC_BASE_IMG_URL}/${model?.model_images[0]?.image[0]?.src}`}
                    // layout='fill'
                    width={282}
                    height={282}
                    alt={model?.title}
                    loading="lazy"
                    style={{
                      borderBottomLeftRadius: 4,
                      borderBottomRightRadius: 4,
                      objectFit: 'cover',
                      display: 'block',
                      width: '100%',
                    }}
                  />
                  <Label
                    sx={{ width: "100%", display: "flex", justifyContent: "space-between", padding: "16px 0", alignItems: "center" }}
                  >
                    <Skeleton
                      variant="rectangular"
                      width={83}
                      height={21}
                    />
                    <Skeleton
                      variant="rectangular"
                      width={50}
                      height={24}
                    />
                  </Label>
                </Box>
              </a>
            </Grid>
          ))}
        </Grid>
      </>
    )
  }

  return (
    <></>
  )

}