interface Props {
  name: string
}

export default function Header({ name }: Props) {
  const renderTitle = (name: string) => {
    const nameArray = name.split("-");
    nameArray[nameArray.length - 1] = `(${nameArray[nameArray.length - 1]})`;
    return nameArray.join(" ");
  }

  return (
    <div className="h-96 overflow-hidden">
      <div
        className="bg-center bg-gradient-to-r from-[#0f1f47] to-[#5f6984] h-full flex justify-center items-center"
      >
        <h1 className="text-7xl text-white captitalize text-shadow text-center capitalize">
          {renderTitle(name)}
        </h1>
      </div>
    </div>
  );
}