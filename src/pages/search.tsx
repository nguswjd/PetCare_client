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

function Search() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<Hospital[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (!keyword.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(() => {
      fetchSearchResults(keyword, true);
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword]);

  const saveRecentSearch = (search: string) => {
    const updated = [
      search,
      ...recentSearches.filter((s) => s !== search),
    ].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const removeRecentSearch = (search: string) => {
    const updated = recentSearches.filter((s) => s !== search);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  async function fetchHospitals(params: Record<string, any>) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "")
        query.append(key, value);
    });

    const res = await fetch(
      `${BASE_URL}/api/v1/hospitals/search?${query.toString()}`
    );
    if (!res.ok) throw new Error("검색 실패");
    return res.json();
  }

  const fetchSearchResults = async (searchKeyword: string, silent = false) => {
    if (!searchKeyword.trim()) return;

    if (!silent) setIsSearching(true);
    setHasSearched(true);

    try {
      const hospitals: Hospital[] = await fetchHospitals({
        keyword: searchKeyword,
      });
      setSearchResults(hospitals || []);
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    } finally {
      if (!silent) setIsSearching(false);
    }
  };

  const handleSearch = async (searchKeyword?: string) => {
    const searchTerm = searchKeyword || keyword;
    if (!searchTerm.trim()) return;
    saveRecentSearch(searchTerm);
    await fetchSearchResults(searchTerm);
  };

  const handleRecentSearchClick = (search: string) => {
    setKeyword(search);
    saveRecentSearch(search);
  };

  const handleHospitalClick = (hospital: Hospital) => {
    saveRecentSearch(keyword);
    navigate(`/hospital/${hospital.id}`);
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
            <div className="flex items-center justify-between pb-5 border-b border-gray-3">
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
                {searchResults.map((hospital) => (
                  <Card
                    key={hospital.id}
                    size="lg"
                    image={hospital.imageUrl || "/images/default-hospital.png"}
                    alt={hospital.name}
                    name={hospital.name}
                    address={hospital.address.split(" ").slice(0, 2).join(" ")}
                    businessStatus={hospital.operatingStatus}
                    content={hospital.description}
                    onClick={() => handleHospitalClick(hospital)}
                    className="p-4 border-b border-gray-2 cursor-pointer hover:bg-gray-1 transition-colors"
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Search;
