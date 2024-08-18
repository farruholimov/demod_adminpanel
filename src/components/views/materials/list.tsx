"use client"

import React, { CSSProperties, Suspense, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Grid, Box, useMediaQuery, SxProps, List, ListItem, ListItemText, ListItemAvatar, Divider, Skeleton, Input, TextField, FormControl, MenuItem, styled, Menu } from '@mui/material'
import SimpleTypography from '../../typography'
import { useRouter, useSearchParams } from 'next/navigation'
import Buttons from '../../buttons'
import Image from 'next/image'
import EmptyData from '../empty_data'
import { ThemeProps } from '../../../types/theme'
import instance from '../../../utils/axios'
import { toast } from 'react-toastify'
import { ConfirmContextProps, resetConfirmData, resetConfirmProps, setConfirmProps, setConfirmState, setMaterialFormState, setOpenModal } from '../../../data/modal_checker'
import { getAllMaterials, selectAllMaterials, selectAllMaterials_status } from '../../../data/get_all_materials'

const fakeBrands = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const liHeaderTextSx = {
  fontSize: '11px',
  fontWeight: 700,
  lineHeight: '16px',
  letterSpacing: '0.05em',
  textAlign: 'start',
  color: '#686868',
  textTransform: 'uppercase'
}

const modelImageWrapperSx: SxProps = {
  backgroundColor: '#fff',
  // border: '1px solid #E0E0E0',
  // borderRadius: '8px',
  width: '36px',
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
}

const modelImageSx: CSSProperties = {
  width: '100% !important',
  height: '100% !important',
  // borderRadius: '8px',
  objectFit: 'contain'
}

const liSx: SxProps = {
  justifyContent: 'flex-start',
  padding: '0px 24px',
  backgroundColor: '#fcfcfc',
  transition: '0.4s all ease',
  marginBottom: '2px',

  '&:hover': {
    backgroundColor: '#fff',
    boxShadow: '0px 3px 4px 0px #00000014',
  },
  '&:hover .brand_name': {
    color: '#0646E6 !important',
  },
}

const liHeaderSx: SxProps = {
  display: 'flex',
  backgroundColor: '#fff',
  padding: '10px 24px',
  marginBottom: '2px',
}

const listSx: SxProps = {
  width: '100%',
  backgroundColor: '#f5f5f5',
  // border: '1px solid #E0E0E0',
  borderRadius: '4px',
  padding: '0',
}


const widthControl = {

  '&:nth-of-type(1)': {
    minWidth: '45%',
    maxWidth: '45%',
  },
  '&:nth-of-type(2)': {
    minWidth: '45%',
    maxWidth: '45%',
  },
  '&:nth-of-type(3)': {
    minWidth: '10%',
    maxWidth: '10%',
    justifyContent: 'center',
  }
}

const itemAsLink = {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  height: '46px',
}

const DropDown = styled(Menu)(
  ({ theme }: ThemeProps) => `

  .MuiList-root{
    width:162px;
    border: 1px solid #E0E0E0;
    border-radius: 4px;
    padding: 4px 0;
  }

  .MuiPaper-root{
    border-radius:4px !important;
    box-shadow: 0px 8px 18px 0px #00000029;
  }
  `
);

export default function MaterialsList() {

  const router = useRouter();
  const dispatch = useDispatch<any>();
  const matches = useMediaQuery('(max-width:600px)');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const all__materials_status = useSelector(selectAllMaterials_status)
  const materials = useSelector(selectAllMaterials)

  const [selectedMaterial, setSelectedMaterial] = useState<any>(null)

  function handleClick(event: any, material: any) {
    setSelectedMaterial(material);
    setAnchorEl(event.currentTarget);
  };

  function handleClose() {
    setSelectedMaterial(null);
    setAnchorEl(null);
  };

  function handleOpenAddModal() {
    dispatch(setMaterialFormState({ open: true, editing: false }))
    dispatch(setOpenModal(true))
    handleClose()
  }
  function handleOpenEditModal() {
    dispatch(setMaterialFormState({ open: true, editing: true, material: selectedMaterial }))
    dispatch(setOpenModal(true))
    handleClose()
  }

  function handleClickDelete() {
    const modalContent: ConfirmContextProps = {
      message: `Вы уверены, что хотите удалить материал «${selectedMaterial?.name}»?`,
      actions: {
        on_click: {
          args: [selectedMaterial?.id],
          func: async (checked: boolean, id: number) => {
            dispatch(setConfirmProps({ is_loading: true }))
            instance.delete(`materials/${id}`)
              .then(res => {
                if (res?.data?.success) {
                  toast.success(res?.data?.message)
                  dispatch(getAllMaterials())
                  dispatch(setConfirmState(false))
                  dispatch(setOpenModal(false))
                  dispatch(resetConfirmProps())
                  dispatch(resetConfirmData())
                  handleClose();
                }
                else {
                  toast.success(res?.data?.message)
                  handleClose();
                }
              }).catch(err => {
                toast.error(err?.response?.data?.message)
              }).finally(() => {
                dispatch(setConfirmProps({ is_loading: false }))
                handleClose();
              })
          }
        }
      }
    }
    dispatch(resetConfirmProps())
    dispatch(setConfirmProps(modalContent))
    dispatch(setConfirmState(true))
    dispatch(setOpenModal(true))
  }

  return (
    <>
      <DropDown
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >

        <MenuItem
          onClick={handleOpenEditModal}
          sx={{ padding: "6px 12px" }}
        >
          <Image
            src="/icons/edit-pen.svg"
            alt="icon"
            width={17}
            height={17}
          />
          <SimpleTypography className='drow-down__text' text='Редактировать' />
        </MenuItem>

        <MenuItem
          onClick={handleClickDelete}
          sx={{ padding: "6px 12px" }}
        >
          <Image
            src="/icons/trash.svg"
            alt="icon"
            width={17}
            height={17}
          />
          <SimpleTypography className='drow-down__text' text='Удалить' />

        </MenuItem>

      </DropDown>

      <List
        sx={listSx}
      >
        <ListItem
          key={-3}
          sx={{ ...liHeaderSx, alignItems: 'center', justifyContent: 'space-between' }}
        >
          <SimpleTypography
            text='Материалы'
            sx={{
              fontWeight: 500,
              fontSize: '20px',
              lineHeight: '24px',
              letterSpacing: '-0.02em',
            }}
          />
          <Buttons
            onClick={handleOpenAddModal}
            name="Добавить материал"
            childrenFirst={true}
            type='button'
            className="upload__btn"
            sx={{ height: '37px' }}
          >
            <Image
              alt="icon"
              src='/icons/list-plus.svg'
              width={20}
              height={20}
            />
          </Buttons>
        </ListItem>

        <ListItem alignItems="center"
          key={-2}
          sx={liHeaderSx}
        >
          <SimpleTypography
            text='Название'
            sx={{ ...liHeaderTextSx, ...widthControl }}
          />
          <SimpleTypography
            text='ID'
            sx={{ ...liHeaderTextSx, ...widthControl }}
          />
          <SimpleTypography
            text=''
            sx={{ ...widthControl }}
          />
        </ListItem>
        {
          all__materials_status == 'succeeded' ?
            (
              materials && materials?.data?.length != 0
                ? materials?.data?.map((material, index: any) =>

                  <ListItem key={index} alignItems="center"
                    sx={liSx}
                  >

                    <ListItemText
                      sx={{ ...widthControl, ...itemAsLink }}
                    >
                      <SimpleTypography
                        text={material?.name}
                        sx={{
                          fontSize: '14px',
                          fontWeight: 400,
                          lineHeight: '26px',
                          letterSpacing: '-0.02em',
                          textAlign: 'start',
                        }}
                      />
                    </ListItemText>

                    <ListItemText
                      sx={{ ...widthControl, ...itemAsLink }}
                    >
                      <SimpleTypography
                        text={`#${material?.id}`}
                        sx={{
                          fontSize: '14px',
                          fontWeight: 400,
                          lineHeight: '26px',
                          letterSpacing: '-0.02em',
                        }}
                      />
                    </ListItemText>

                    <ListItemText
                      sx={{
                        ...widthControl,
                        '& span': {
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }
                      }}>
                      <Buttons
                        name=""
                        onClick={(e) => handleClick(e, material)}
                        childrenFirst={true}
                        type='button'
                        className="options_menu__btn"
                        sx={{ ml: '12px', minWidth: '20px', width: '20px', height: '20px' }}
                      >
                        <img
                          alt="icon"
                          src='/icons/options-dots-vertical.svg'
                          width={20}
                          height={20}
                        />
                      </Buttons>
                    </ListItemText>

                  </ListItem>

                )
                : <EmptyData sx={{ marginTop: '8px' }} />
            )
            :
            fakeBrands?.map((i) =>
              <Box key={i}>
                <ListItem key={i} alignItems="center"
                  sx={liSx}
                >

                  <ListItemText sx={{ ...widthControl }} >
                    <Skeleton
                      variant="rectangular"
                      width={100}
                      height={20}
                    />
                  </ListItemText>

                  <ListItemText sx={{ ...widthControl }} >
                    <Skeleton
                      variant="rectangular"
                      width={100}
                      height={20}
                    />
                  </ListItemText>
                  <ListItemText sx={{ ...widthControl }}>
                    <Skeleton
                      variant="rectangular"
                      width={30}
                      height={30}
                    />
                  </ListItemText>
                </ListItem>
              </Box>
            )
        }
      </List>
    </>
  )
}

