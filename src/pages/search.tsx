import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import Input from "../components/ui/input";
import Field from "../components/ui/field";
import Card from "../components/ui/card";
import { ChevronLeft, X } from "lucide-react";

interface Hospital {
  id: number;
  name: string;
  address: string;
  representativeName: string;
  hasParking: boolean;
  departments: string[];
  animalTypes: string[];
  breeds: string[];
  operatingStartTime: string;
  operatingEndTime: string;
  is24Hours: boolean;
  status: string;
  operatingStatus: string;
  imageUrl?: string;
  description?: string;
}

interface SearchHistoryItem {
  id: number;
  keyword: string;
  createdAt: string;
}

function Search() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<Hospital[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isRealTimeSearch, setIsRealTimeSearch] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = !!token;
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      fetchUserSearchHistory();
    } else {
      const saved = localStorage.getItem("recentSearches");
      if (saved) setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (!keyword.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      setIsRealTimeSearch(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsRealTimeSearch(true);
      fetchSearchResults(keyword, true);
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword]);

  const fetchUserSearchHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      const decoded = atob(token);
      const username = decoded.split(":")[0];

      if (!username) {
        return;
      }

      const userIdUrl = `${BASE_URL}/api/v1/users/username/${username}`;

      const userRes = await fetch(userIdUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userRes.ok) {
        return;
      }

      const userData = await userRes.json();
      const userId = userData.id;

      if (!userId) {
        return;
      }

      const historyUrl = `${BASE_URL}/api/v1/search-history/user/${userId}?page=0&size=10`;

      const res = await fetch(historyUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();

        const keywords: string[] = data.content.map(
          (item: SearchHistoryItem) => item.keyword
        );

        const uniqueKeywords = Array.from(new Set(keywords));

        setRecentSearches(uniqueKeywords);
      }
    } catch (err) {
      const saved = localStorage.getItem("recentSearches");
      if (saved) setRecentSearches(JSON.parse(saved));
    }
  };

  const saveRecentSearch = (search: string) => {
    if (isLoggedIn) {
      const updated = [
        search,
        ...recentSearches.filter((s) => s !== search),
      ].slice(0, 10);
      setRecentSearches(updated);
    } else {
      const updated = [
        search,
        ...recentSearches.filter((s) => s !== search),
      ].slice(0, 10);
      setRecentSearches(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    }
  };

  const removeRecentSearch = async (search: string) => {
    if (isLoggedIn) {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = atob(token);
        const username = decoded.split(":")[0];

        const userIdUrl = `${BASE_URL}/api/v1/users/username/${username}`;
        const userRes = await fetch(userIdUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          const userId = userData.id;

          await fetch(
            `${BASE_URL}/api/v1/search-history/user/${userId}/keyword/${encodeURIComponent(
              search
            )}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }

        const updated = recentSearches.filter((s) => s !== search);
        setRecentSearches(updated);
      } catch (err) {
        console.error(err);
      }
    } else {
      const updated = recentSearches.filter((s) => s !== search);
      setRecentSearches(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    }
  };

  const clearAllRecentSearches = async () => {
    if (isLoggedIn) {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = atob(token);
        const username = decoded.split(":")[0];

        const userIdUrl = `${BASE_URL}/api/v1/users/username/${username}`;
        const userRes = await fetch(userIdUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          const userId = userData.id;

          await fetch(`${BASE_URL}/api/v1/search-history/user/${userId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        setRecentSearches([]);
      } catch (err) {
        console.error(err);
      }
    } else {
      setRecentSearches([]);
      localStorage.removeItem("recentSearches");
    }
  };

  async function fetchHospitals(
    params: Record<string, any>,
    saveHistory = false
  ) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "")
        query.append(key, value);
    });

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (saveHistory) {
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const res = await fetch(
      `${BASE_URL}/api/v1/hospitals/search?${query.toString()}`,
      { headers }
    );

    if (!res.ok) throw new Error("검색 실패");
    return res.json();
  }

  const fetchSearchResults = async (searchKeyword: string, silent = false) => {
    if (!searchKeyword.trim()) return;
    if (!silent) setIsSearching(true);
    setHasSearched(true);

    try {
      const hospitals: Hospital[] = await fetchHospitals(
        {
          keyword: searchKeyword,
        },
        !silent
      );
      setSearchResults(hospitals || []);
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    } finally {
      if (!silent) setIsSearching(false);
    }
  };

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setIsRealTimeSearch(false);
    saveRecentSearch(keyword);
    await fetchSearchResults(keyword);
  };

  const handleRecentSearchClick = (search: string) => {
    setKeyword(search);
    setIsRealTimeSearch(false);
    saveRecentSearch(search);
  };

  const handleHospitalClick = (hospital: Hospital, saveToRecent = false) => {
    if (saveToRecent) {
      saveRecentSearch(hospital.name);
    }
    navigate(`/hospital/${hospital.id}`);
  };

  const highlightKeyword = (text: string, keyword: string) => {
    if (!keyword.trim()) return text;
    const regex = new RegExp(`(${keyword})`, "gi");
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <span key={index} className="text-blue-1">
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <div className="bg-white flex flex-col h-dvh">
      <header>
        <Input
          leftIcon={ChevronLeft}
          placeholder="검색어를 입력해주세요."
          variant="Search"
          className="m-4"
          onLeftIconClick={() => navigate(-1)}
          onSearchClick={handleSearch}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
      </header>

      <main className="flex-1 overflow-y-auto">
        {!hasSearched ? (
          <div className="p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between pb-2 border-b border-gray-3">
              <h2 className="text-base font-semibold">최근 검색</h2>
              {recentSearches.length > 0 && (
                <button
                  onClick={clearAllRecentSearches}
                  className="text-sm text-gray-5"
                >
                  전체삭제
                </button>
              )}
            </div>
            {recentSearches.length === 0 ? (
              <p className="text-center text-gray-5 py-8">
                최근 검색 내역이 없습니다
              </p>
            ) : (
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <Field
                    key={index}
                    variant="search"
                    value={search}
                    rightIcon={X}
                    onClick={() => handleRecentSearchClick(search)}
                    onRightIconClick={() => removeRecentSearch(search)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col">
            {searchResults.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-5">검색 결과가 없습니다</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {searchResults.map((hospital) =>
                  isRealTimeSearch ? (
                    <div
                      key={hospital.id}
                      onClick={() => handleHospitalClick(hospital)}
                      className="py-4 mx-4 border-b border-gray-2 cursor-pointer transition-colors"
                    >
                      <h3 className="font-semibold text-base mb-1">
                        {highlightKeyword(hospital.name, keyword)}
                      </h3>
                      <p className="text-sm text-gray-5">
                        {highlightKeyword(
                          hospital.address.split(" ").slice(0, 2).join(" "),
                          keyword
                        )}
                      </p>
                    </div>
                  ) : (
                    <Card
                      key={hospital.id}
                      size="lg"
                      image={
                        hospital.imageUrl || "/images/default-hospital.png"
                      }
                      alt={hospital.name}
                      name={hospital.name}
                      address={hospital.address
                        .split(" ")
                        .slice(0, 2)
                        .join(" ")}
                      businessStatus={hospital.operatingStatus}
                      content={hospital.description}
                      onClick={() => handleHospitalClick(hospital)}
                      className="p-4 border-b border-gray-2 cursor-pointer transition-colors"
                    />
                  )
                )}
              </div>
            )}
            {isRealTimeSearch && recentSearches.length > 0 && (
              <div className="p-6 flex flex-col gap-6">
                <div className="flex items-center justify-between pb-5 border-b border-gray-3">
                  <h2 className="text-base font-semibold">최근 검색</h2>
                  <button
                    onClick={clearAllRecentSearches}
                    className="text-sm text-gray-5"
                  >
                    전체삭제
                  </button>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <Field
                      key={index}
                      variant="search"
                      value={search}
                      rightIcon={X}
                      onClick={() => handleRecentSearchClick(search)}
                      onRightIconClick={() => removeRecentSearch(search)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Search;
