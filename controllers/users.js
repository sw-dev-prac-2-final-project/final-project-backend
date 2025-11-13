const User = require("../models/User");
const Request = require("../models/Request");

const ALLOWED_ROLES = ["admin", "staff"];

/**
 * Build a lookup table keyed by userId with request counts
 * grouped by transaction type for fast access when shaping
 * the API response.
 */
const buildRequestLookup = async (userIds) => {
  if (!userIds.length) {
    return new Map();
  }

  const stats = await Request.aggregate([
    {
      $match: {
        user: { $in: userIds },
      },
    },
    {
      $group: {
        _id: { user: "$user", type: "$transactionType" },
        count: { $sum: 1 },
      },
    },
  ]);

  const lookup = new Map();

  stats.forEach((stat) => {
    const userId = stat._id.user.toString();
    const type = stat._id.type;

    if (!lookup.has(userId)) {
      lookup.set(userId, { totalRequests: 0, stockIn: 0, stockOut: 0 });
    }

    const entry = lookup.get(userId);
    entry.totalRequests += stat.count;
    if (type === "stockIn") {
      entry.stockIn += stat.count;
    } else if (type === "stockOut") {
      entry.stockOut += stat.count;
    }
  });

  return lookup;
};

// @desc    Get directory of users with request statistics
// @route   GET /api/v1/users
// @access  Private (Admin only)
exports.getUsers = async (req, res, next) => {
  try {
    const { role, includeRequests } = req.query;
    const shouldIncludeRequests = includeRequests !== "false";

    if (role && !ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        error: `Invalid role filter. Allowed roles: ${ALLOWED_ROLES.join(", ")}`,
      });
    }

    const query = role ? { role } : {};

    const users = await User.find(query)
      .select("-password -__v")
      .sort({ name: 1 });

    const userIds = users.map((user) => user._id);
    const requestLookup = shouldIncludeRequests
      ? await buildRequestLookup(userIds)
      : new Map();

    const roleSummary = ALLOWED_ROLES.reduce((acc, currentRole) => {
      acc[currentRole] = 0;
      return acc;
    }, {});
    const aggregatedRequests = shouldIncludeRequests
      ? { totalRequests: 0, stockIn: 0, stockOut: 0 }
      : null;

    const data = users.map((user) => {
      const userObj = user.toObject();
      let requestSummary;

      if (shouldIncludeRequests) {
        requestSummary =
          requestLookup.get(user._id.toString()) || {
            totalRequests: 0,
            stockIn: 0,
            stockOut: 0,
          };

        aggregatedRequests.totalRequests += requestSummary.totalRequests;
        aggregatedRequests.stockIn += requestSummary.stockIn;
        aggregatedRequests.stockOut += requestSummary.stockOut;
      }

      if (!roleSummary[userObj.role]) {
        roleSummary[userObj.role] = 0;
      }
      roleSummary[userObj.role] += 1;

      const entry = {
        id: userObj._id.toString(),
        name: userObj.name,
        email: userObj.email,
        tel: userObj.tel,
        role: userObj.role,
        createdAt: userObj.createdAt,
      };

      return shouldIncludeRequests
        ? { ...entry, requestSummary }
        : entry;
    });

    const responsePayload = {
      success: true,
      count: data.length,
      roleFilter: role || "all",
      roleSummary: { ...roleSummary, total: data.length },
      data,
    };

    if (shouldIncludeRequests) {
      responsePayload.requestSummary = aggregatedRequests;
    }

    res.status(200).json(responsePayload);
  } catch (error) {
    next(error);
  }
};
