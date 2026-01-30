import { useState, useEffect } from "react";
import {
  Siren,
  Users,
  MapPin,
  Calendar,
  Heart,
  CheckCircle,
} from "@phosphor-icons/react";
import { api } from "../../services/api";
import { useApp } from "../../context/AppContext";

const HealthCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [impactStats, setImpactStats] = useState(null);
  const { addNotification } = useApp();

  useEffect(() => {
    loadCampaignData();
  }, []);

  const loadCampaignData = async () => {
    const activeCampaigns = await api.getHealthCampaigns();
    const userEnrollments = await api.getUserHealthCampaigns();
    const stats = await api.getHealthCampaignImpact();

    setCampaigns(activeCampaigns);
    setEnrolled(userEnrollments);
    setImpactStats(stats);
  };

  const enrollInCampaign = async (campaignId) => {
    await api.enrollInHealthCampaign(campaignId);
    addNotification({
      title: "Enrolled Successfully",
      message: "You'll receive reminders for this campaign",
      type: "success",
    });
    loadCampaignData();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Impact Statistics */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-6">Community Health Impact</h2>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <h3 className="text-4xl font-bold mb-1">
              {impactStats?.vaccinations || 0}
            </h3>
            <p className="text-rose-100 text-sm">Vaccinations Administered</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold mb-1">
              {impactStats?.screenings || 0}
            </h3>
            <p className="text-rose-100 text-sm">Health Screenings</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold mb-1">
              {impactStats?.participants || 0}
            </h3>
            <p className="text-rose-100 text-sm">Community Participants</p>
          </div>
        </div>
      </div>

      {/* Active Campaigns */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4">
          Active Health Campaigns
        </h3>
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="p-6 border-2 border-slate-200 rounded-xl hover:border-rose-300 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center ${campaign.iconBg}`}
                  >
                    {campaign.type === "vaccination" && (
                      <Siren
                        size={28}
                        className={campaign.iconColor}
                        weight="duotone"
                      />
                    )}
                    {campaign.type === "awareness" && (
                      <Heart
                        size={28}
                        className={campaign.iconColor}
                        weight="duotone"
                      />
                    )}
                    {campaign.type === "screening" && (
                      <Users
                        size={28}
                        className={campaign.iconColor}
                        weight="duotone"
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">
                      {campaign.name}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {campaign.description}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${campaign.statusBg} ${campaign.statusColor}`}
                >
                  {campaign.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                <div className="flex items-center text-slate-600">
                  <Calendar size={16} className="mr-2" />
                  <span>{campaign.date}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <MapPin size={16} className="mr-2" />
                  <span>{campaign.location}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <Users size={16} className="mr-2" />
                  <span>
                    {campaign.enrolled}/{campaign.capacity}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {campaign.free && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                      FREE
                    </span>
                  )}
                  {campaign.priority && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                      PRIORITY
                    </span>
                  )}
                </div>
                <button
                  onClick={() => enrollInCampaign(campaign.id)}
                  className="px-6 py-2 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700 transition-colors"
                  disabled={enrolled.includes(campaign.id)}
                >
                  {enrolled.includes(campaign.id) ? (
                    <span className="flex items-center">
                      <CheckCircle size={18} className="mr-2" weight="fill" />
                      Enrolled
                    </span>
                  ) : (
                    "Enroll Now"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Enrollments */}
      {enrolled.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">
            My Upcoming Campaigns
          </h3>
          <div className="space-y-3">
            {campaigns
              .filter((c) => enrolled.includes(c.id))
              .map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-4 bg-rose-50 border border-rose-200 rounded-lg"
                >
                  <div>
                    <h4 className="font-bold text-slate-800">
                      {campaign.name}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {campaign.date} at {campaign.location}
                    </p>
                  </div>
                  <button className="text-sm text-rose-600 font-medium hover:underline">
                    Add to Calendar
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthCampaigns;
