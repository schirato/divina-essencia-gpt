import { ButtonHTMLAttributes } from 'react'

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement>){
  const { className = '', ...rest } = props
  return <button {...rest} className={`btn ${className}`} />
}
