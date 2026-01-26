import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Loader2 } from "lucide-react";
import { notifyError, notifySuccess, notifyWarning } from "@/utils/notification";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  addressService,
  CityResponse,
  DistrictResponse,
  WardResponse
} from "@/services/addressService";
import { authService } from "@/services/authService";

interface CompanyFormData {
  name: string;
  description: string;
  website: string;
  logoUrl: string;
  industry: string;
  size: string;
  street: string;
  cityCode: string;
  districtCode: string;
  wardCode: string;
  taxCode: string;
  businessLicenseUrl: string;
}


const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Retail",
  "Manufacturing",
  "Education",
  "Real Estate",
  "Transportation",
  "Hospitality",
  "Other",
];

const COMPANY_SIZES = [
  { label: "1-10 employees", value: 10 },
  { label: "11-50 employees", value: 50 },
  { label: "51-200 employees", value: 200 },
  { label: "201-500 employees", value: 500 },
  { label: "501-1000 employees", value: 1000 },
  { label: "1000+ employees", value: 5000 },
];

const RegisterNewCompany = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CompanyFormData>({
    name: "",
    description: "",
    website: "",
    logoUrl: "",
    industry: "",
    size: "",
    street: "",
    cityCode: "",
    districtCode: "",
    wardCode: "",
    taxCode: "",
    businessLicenseUrl: "",
  });
  const [loading, setLoading] = useState(false);

  // State for address data
  const [cities, setCities] = useState<CityResponse[]>([]);
  const [districts, setDistricts] = useState<DistrictResponse[]>([]);
  const [wards, setWards] = useState<WardResponse[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // Fetch cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const citiesData = await addressService.getAllCities();
        setCities(citiesData);
      } catch (error) {
        console.error("Error loading cities:", error);
        notifyError("Không thể tải danh sách thành phố.");
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  // Fetch districts when city changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!formData.cityCode) {
        setDistricts([]);
        return;
      }

      setLoadingDistricts(true);
      try {
        const districtsData = await addressService.getDistrictsByCityCode(
          formData.cityCode
        );
        setDistricts(districtsData);
      } catch (error) {
        console.error("Error loading districts:", error);
        notifyError("Không thể tải danh sách quận/huyện.");
      } finally {
        setLoadingDistricts(false);
      }
    };

    fetchDistricts();
  }, [formData.cityCode]);

  // Fetch wards when district changes
  useEffect(() => {
    const fetchWards = async () => {
      if (!formData.districtCode) {
        setWards([]);
        return;
      }

      setLoadingWards(true);
      try {
        const wardsData = await addressService.getWardsByDistrictCode(
          formData.districtCode
        );
        setWards(wardsData);
      } catch (error) {
        console.error("Error loading wards:", error);
        notifyError("Không thể tải danh sách phường/xã.");
      } finally {
        setLoadingWards(false);
      }
    };

    fetchWards();
  }, [formData.districtCode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Reset dependent fields when parent changes
    if (field === "cityCode") {
      setFormData((prev) => ({
        ...prev,
        districtCode: "",
        wardCode: "",
      }));
    } else if (field === "districtCode") {
      setFormData((prev) => ({
        ...prev,
        wardCode: "",
      }));
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (
        !formData.name ||
        !formData.taxCode ||
        !formData.businessLicenseUrl ||
        !formData.cityCode ||
        !formData.districtCode ||
        !formData.wardCode
      ) {
        notifyWarning("Vui lòng điền tất cả các trường bắt buộc.");
        setLoading(false);
        return;
      }

      // Prepare request data - match backend CompanyRegisterRequest schema
      const requestData = {
        name: formData.name,
        description: formData.description || "",
        website: formData.website || "",
        logoUrl: formData.logoUrl || "",
        industry: formData.industry || "",
        size: formData.size ? parseInt(formData.size) : 0,
        address: {
          street: formData.street || "",
          cityCode: formData.cityCode,
          districtCode: formData.districtCode,
          wardCode: formData.wardCode,
        },
        taxCode: formData.taxCode,
        businessLicenseUrl: formData.businessLicenseUrl,
      };

      console.log("📤 Sending company registration data:", JSON.stringify(requestData, null, 2));

      // Call API to register company
      const response = await authService.registerCompany(requestData);

      if (!response.success) {
        notifyError(response.message);
        setLoading(false);
        return;
      }

      // Store company data in sessionStorage
      sessionStorage.setItem("companyFormData", JSON.stringify(formData));

      notifySuccess({
        title: "Đăng ký thành công",
        description: "Đơn đăng ký công ty của bạn đã được gửi và đang chờ phê duyệt.",
      });

      // Navigate to awaiting approval page
      navigate("/awaiting-approval");
    } catch (err) {
      console.error("Error registering company:", err);
      notifyError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 py-8">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="gradient-primary p-3 rounded-lg shadow-glow">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl text-gradient">Business Account</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Register New Company</h1>
          <p className="text-muted-foreground">Fill in your company details</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Company Information Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Company Information</h3>

            <div>
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                placeholder="Tech Corp"
                className="mt-1"
                value={formData.name}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Company Description</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Tell candidates about your company..."
                className="mt-1"
                value={formData.description}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://company.com"
                  className="mt-1"
                  value={formData.website}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => handleSelectChange("industry", value)}
                  disabled={loading}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((ind) => (
                      <SelectItem key={ind} value={ind}>
                        {ind}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="size">Company Size</Label>
                <Select
                  value={formData.size}
                  onValueChange={(value) => handleSelectChange("size", value)}
                  disabled={loading}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANY_SIZES.map((s) => (
                      <SelectItem key={s.value} value={String(s.value)}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  type="url"
                  placeholder="https://..."
                  className="mt-1"
                  value={formData.logoUrl}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Address</h3>

            <div>
              <Label htmlFor="cityCode">City *</Label>
              <Select
                value={formData.cityCode}
                onValueChange={(value) => handleSelectChange("cityCode", value)}
                disabled={loading || loadingCities}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={loadingCities ? "Loading..." : "Select city"} />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.code} value={city.code}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="districtCode">District *</Label>
              <Select
                value={formData.districtCode}
                onValueChange={(value) => handleSelectChange("districtCode", value)}
                disabled={loading || !formData.cityCode || loadingDistricts}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={loadingDistricts ? "Loading..." : "Select district"} />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district.code} value={district.code}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="wardCode">Ward *</Label>
              <Select
                value={formData.wardCode}
                onValueChange={(value) => handleSelectChange("wardCode", value)}
                disabled={loading || !formData.districtCode || loadingWards}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={loadingWards ? "Loading..." : "Select ward"} />
                </SelectTrigger>
                <SelectContent>
                  {wards.map((ward) => (
                    <SelectItem key={ward.code} value={ward.code}>
                      {ward.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="street">Street</Label>
              <Input
                id="street"
                placeholder="123 Main Street"
                className="mt-1"
                value={formData.street}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
          </div>

          {/* Legal Information Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Legal Information</h3>

            <div>
              <Label htmlFor="taxCode">Tax Code *</Label>
              <Input
                id="taxCode"
                placeholder="0123456789"
                className="mt-1 font-mono"
                value={formData.taxCode}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            </div>

            <div>
              <Label htmlFor="businessLicenseUrl">Business License URL *</Label>
              <Input
                id="businessLicenseUrl"
                type="url"
                placeholder="https://..."
                className="mt-1"
                value={formData.businessLicenseUrl}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Please upload your business license or registration certificate
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/business-choice")}
              disabled={loading}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="w-full gradient-primary shadow-glow"
              size="lg"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Submitting..." : "Submit for Approval"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RegisterNewCompany;
