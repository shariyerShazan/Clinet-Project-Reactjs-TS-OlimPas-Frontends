

import { useState, useEffect } from "react"
import axios from "axios"
import DSkeletonTable from "./SkeletonTable"

interface Redeem {
  id: string
  redeemedAt: string
  registration: {
    firstName: string
    lastName: string
    email: string
    membershipId: string
  }
  partner: {
    name: string
    discount: string
    category: {
      name: string
    }
  }
}

interface PaginationData {
  data: Redeem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function DRedeems() {
  const [paginationData, setPaginationData] = useState<PaginationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)

  useEffect(() => {
    fetchRedeems()
  }, [page])

  const fetchRedeems = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`http://localhost:3000/redeem?page=${page}&limit=${limit}`, {
        withCredentials: true,
      })
      setPaginationData(response.data)
    } catch (err) {
      console.error("Failed to fetch redeems", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#1a1a1a] shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Redeems</h2>
      </div>

      {loading ? (
        <DSkeletonTable rows={limit} columns={7} />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-[#121212]">
                <tr>
                  {["User", "Email", "Membership ID", "Partner", "Discount", "Category", "Redeemed At"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {paginationData?.data.map((redeem) => (
                  <tr key={redeem.id} className="hover:bg-[#121212] transition-colors">
                    <td className="px-6 py-4 text-sm text-white">
                      {redeem.registration.firstName} {redeem.registration.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{redeem.registration.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{redeem.registration.membershipId}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{redeem.partner.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{redeem.partner.discount}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{redeem.partner.category.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(redeem.redeemedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-700 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 rounded-md text-sm font-medium bg-[#121212] text-gray-300 hover:bg-[#222] disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === paginationData?.totalPages}
                className="px-4 py-2 rounded-md text-sm font-medium bg-[#121212] text-gray-300 hover:bg-[#222] disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(page * limit, paginationData?.total || 0)}</span> of{" "}
                  <span className="font-medium">{paginationData?.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-2 py-2 rounded-l-md bg-[#121212] text-gray-400 hover:bg-[#222] disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: paginationData?.totalPages || 0 }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-4 py-2 border text-sm font-medium ${
                        pageNum === page
                          ? "z-10 bg-[#F80B58] border-[#F80B58] text-white"
                          : "bg-[#121212] border-gray-700 text-gray-400 hover:bg-[#222]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === paginationData?.totalPages}
                    className="px-2 py-2 rounded-r-md bg-[#121212] text-gray-400 hover:bg-[#222] disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
