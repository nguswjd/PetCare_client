import { useState, useEffect } from "react";

export interface SelectOption {
  label: string;
  value: string;
}

export const useAnimalTypes = (animalType?: string) => {
  const [animalTypes, setAnimalTypes] = useState<SelectOption[]>([]);
  const [breeds, setBreeds] = useState<SelectOption[]>([]);

  useEffect(() => {
    fetchAnimalTypes();
  }, []);

  useEffect(() => {
    if (!animalType) {
      setBreeds([]);
      return;
    }

    fetchBreeds(animalType);
  }, [animalType]);

  const fetchAnimalTypes = async () => {
    try {
      const res = await fetch("/api/v1/animal-types");
      if (!res.ok) throw new Error("동물 종류 불러오기 실패");
      const data = await res.json();

      const arrayData = Array.isArray(data) ? data : data.types || [];
      const options: SelectOption[] = arrayData.map((item: any) => ({
        label: item.description || item.name,
        value: item.code || item.id,
      }));

      setAnimalTypes(options);
    } catch (err) {
      console.error(err);
      setAnimalTypes([]);
    }
  };

  const fetchBreeds = async (type: string) => {
    try {
      const res = await fetch(`/api/v1/breeds/${type}`);
      if (!res.ok) throw new Error("품종 불러오기 실패");
      const data = await res.json();
      const options: SelectOption[] = Array.isArray(data.breeds)
        ? data.breeds.map((item: any) => ({
            label: item.description,
            value: item.code,
          }))
        : [];
      setBreeds(options);
    } catch (err) {
      console.error(err);
      setBreeds([]);
    }
  };

  const getAnimalTypeLabel = (value: string) => {
    const found = animalTypes.find((option) => option.value === value);
    return found ? found.label : value;
  };

  const getBreedLabel = (value: string, breedOptions: SelectOption[]) => {
    if (!value) return "";
    const found = breedOptions.find((option) => option.value === value);
    return found ? found.label : "";
  };

  return {
    animalTypes,
    breeds,
    getAnimalTypeLabel,
    getBreedLabel,
  };
};
