import React, { useRef, useEffect, useState, useContext } from 'react'
import { CommentsContext } from '@/context/comments'
import Picker from 'emoji-picker-react'
import './InputField.scss'

function useOutsideAlerter(ref: any, setOpen: Function) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(!open)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref])
}

interface EmojiInputProps {
  text: string
  setText: Function
  mode?: string
  inputStyle?: object
}

const EmojiInput = ({ text, setText, mode, inputStyle }: EmojiInputProps) => {
  const [open, setOpen] = useState(false)
  const [chosenEmoji, setChosenEmoji] = useState<{ emoji?: any }>()
  const wrapperRef = useRef(null)
  useOutsideAlerter(wrapperRef, setOpen)

  const globalStore: any = useContext(CommentsContext)

  useEffect(() => {
    if (chosenEmoji) {
      let newText = text + ' ' + chosenEmoji.emoji
      setText(newText)
    }
  }, [chosenEmoji])

  const onEmojiClick = (emojiObject: any, event: MouseEvent) => {
    setChosenEmoji(emojiObject)
  }

  return (
    <div className='emoji-input'>
      <input
        className='postComment'
        style={
          mode === 'replyMode' || mode === 'editMode'
            ? globalStore.replyInputStyle
            : globalStore.inputStyle || inputStyle
        }
        placeholder='Напишите свой комментарий здесь'
        type='text'
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className='emoji-icon' onClick={() => setOpen(!open)}></div>
      {open ? (
        <div ref={wrapperRef}>
          <Picker onEmojiClick={onEmojiClick} />
        </div>
      ) : null}
    </div>
  )
}

export default EmojiInput
