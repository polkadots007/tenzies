import React from 'react'
import Confetti from 'react-confetti'

export default () => {

  return (
    <Confetti
      width={window.innerWidth}
      height={window.innerHeight}
    />
  )
}