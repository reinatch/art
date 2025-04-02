import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center h-screen text-center w-full uppercase'>
      <h2>ooops</h2>
      <p>not found</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}