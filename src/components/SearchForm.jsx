'use client'

import axios from 'axios'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

const SearchForm = () => {
  const [users, setUsers] = useState([])
  const [searchInput, setSearchInput] = useState('')

  const getUserData = async () => {
    try {
      const url = 'https://randomuser.me/api?results=1'
      const res = await axios.get(url)
      if (res.status !== 200) throw new Error('Connection Error')
      const data = await res.data.results[0]
      setUsers((prevUsers) => [...prevUsers, data])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    console.log(users)
  }, [users])

  const handleForm = (e) => {
    e.preventDefault()
  }

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const searchQuery = searchParams.get('search')
    if (searchQuery) {
      setSearchInput(searchQuery)
    }
  }, [searchParams])

  const handleSearch = (text) => {
    // console.log(text)
    setSearchInput(text.toLowerCase().trim())

    const params = new URLSearchParams(searchParams)
    if (text) {
      params.set('search', text)
    } else {
      params.delete('search')
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  const filteredUsers = users.filter((user) => {
    const { first, last } = user.name
    return (
      first.toLowerCase().includes(searchInput.toLowerCase()) ||
      last.toLowerCase().includes(searchInput.toLowerCase())
    )
  })

  return (
    <div className="w-full">
      <div className="border rounded-lg p-1 m-1 min-h-28 flex flex-col justify-evenly items-center">
        <form onSubmit={handleForm}>
          <input
            type="text"
            id="search"
            onChange={(e) => {
              handleSearch(e.target.value)
            }}
            value={searchInput}
            // defaultValue={searchParams.get('search')?.toString()}
            placeholder="Search in users"
            className="outline-none hover:shadow-lg rounded-md px-1 text-center"
          />
        </form>
        <button
          className="bg-blue-500 rounded-md p-1 hover:text-slate-200 hover:bg-blue-600"
          type="button"
          onClick={() => getUserData()}
        >
          Get Random User
        </button>
      </div>
      <div className=" p-1 m-1">
        {filteredUsers.map((user) => {
          const { title, first, last } = user.name

          return (
            <div
              className="border rounded-sm text-center m-2"
              key={user.login.uuid}
            >
              <h2>
                {title} {first} <br /> {last}
              </h2>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function () {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SearchForm />
    </Suspense>
  )
}
